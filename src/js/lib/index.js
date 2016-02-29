import angular from 'angular';
import { EmployeeList, Schedule } from './core';
import { mapCollection } from './utils';

let app = angular.module('scheduleCalculator');

let data;

app.filter('time', [
  '$locale',
  function ($locale) {
    return function (dateObject) {
      return dateObject.toLocaleString(
        $locale, { hour: 'numeric', minute: 'numeric' });
    };
  }
]);

app.factory('userSessionData', [
  '$http', '$q', 'APISERVER',
  function ($http, $q, APISERVER) {
    let userSessionData = {
      userId: null,
      employeeList: null,
      schedules: {},
      saveUserId(userId) {
        this.userId = userId;
        localStorage.setItem('userId', this.userId);
      },
      clearUserId() {
        localStorage.clearItem('userId');
      },
      saveEmployeeList() {
        let elist = JSON.stringify(this.employeeList._save());
        localStorage.setItem('employeeList', elist);
      },
      clearSchedule(id) {
        localStorage.removeItem(`schedules/${id}`);
        delete this.schedules[id];
      },
      saveSchedule(id) {
        if (!(id in this.schedules)) {
          throw new Error('Trying to save an id not in schedules');
        }
        this.schedules[id]._isSaved = true;
        let sched = this.schedules[id]._save();
        let elist = this.employeeList._save();
        localStorage.setItem(`schedules/${id}`, JSON.stringify(sched));

        // Post to the server
        let data = JSON.stringify({
          userId: this.userId,
          scheduleId: id,
          data: sched,
          employeeList: elist
        });
        return $http.post(`${APISERVER}/schedule`, data);
      },
      clear() {
        localStorage.clear();
        this.schedules = {};
        localStorage.setItem('userId', this.userId);
        localStorage.setItem('employeeList', this.employeeList);
      },
      saveSchedules() {
        Object.keys(this.schedules).map(id => this.saveSchedule(id));
      },
      sync() {
        // load in data from storage
        let localData = {
          userId: localStorage.getItem('userId'),
          employeeList: localStorage.getItem('employeeList'),
          schedules: []
        };
        let len = localStorage.length;
        for (let i = 0; i < len; i++) {
          let key = localStorage.key(i);
          if (key.indexOf('schedules/') !== 0) { continue; }
          let sched = localStorage.getItem(key);
          localData.schedules.push(sched);
        }

        try {
          // refresh own state to match
          this.userId = localData.userId;
          this.employeeList = localData.employeeList
            ? EmployeeList._restore(JSON.parse(localData.employeeList))
            : new EmployeeList();
          this.schedules = {};
          for (let sched of localData.schedules) {
            sched = Schedule._restore(JSON.parse(sched));
            sched._isSaved = true;
            this.schedules[sched.id] = sched;
          }
        } catch (err) {
          console.error(err);
        } finally {
          if (!(this.employeeList instanceof EmployeeList)) {
            this.employeeList = new EmployeeList();
          }
          this.employeeList.onChange(() => userSessionData.saveEmployeeList());
        }

        return $http.post(`${APISERVER}/user-data/${this.userId}`, localData)
          .then(function (data) {
            console.log('data returned from api', data);
            if (!data.schedules) { return; }
            let schedules = userSessionData.schedules = {};
            for (sched of data.schedules) {
              schedules[sched.id] = Schedule._restore(sched);
            }
          });
      },
      logout() {
        localStorage.clear();
      }
    };

    userSessionData.sync();

    return userSessionData;
  }
]);

app.factory('employeeList', [
  'userSessionData',
  function (userSessionData) {
    return userSessionData.employeeList;
  }
]);

app.factory('schedules', [
  'userSessionData',
  function (userSessionData) {
    let schedules = userSessionData.schedules;
    let schedule;
    return {
      current() { return schedule; },
      add(date) {
        schedule = new Schedule(date);
        schedules[schedule.id] = schedule;
        return schedule;
      },
      clear(id) {
        userSessionData.clearSchedule(id)
      },
      save(id) {
        userSessionData.saveSchedule(id);
      },
      get(id) {
        let sched = schedules[id];
        schedule = sched;
        return sched;
      },
      list() {
        return Object.keys(schedules)
          .map(key => schedules[key])
          .sort(function (a, b) { return a.date - b.date; });
      },
      shifts(employeeId) {
        let list = this.list();
        let shifts = list.reduce(function (shifts, sched) {
          return shifts.concat(sched.listShifts());
        }, []);
        let matches = shifts.filter(shift => shift.employeeId === employeeId);
        return matches;
      },
      // total number of hours worked by the employee
      total(employeeId) {
        let shifts = this.shifts(employeeId);
        let totalMs = shifts.reduce(function (total, shift) {
          return total + (shift.endTime - shift.startTime);
        }, 0);
        return totalMs / 1000 / 60 / 60;
      },
      nextDate() {
        let schedules = this.list();
        let latest = schedules[schedules.length - 1];
        let d;
        if (latest) {
          d = new Date(latest.date);
          d.setDate(d.getDate() + 1);
        } else {
          d = new Date();
        }
        return d;
      }
    };
  }
]);
