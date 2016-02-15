import angular from 'angular';
import { EmployeeList, Schedule } from './core';
import { mapCollection } from './utils';

let app = angular.module('scheduleCalculator');

let data;

let saveEmployeeList = function () {
  let elist = JSON.stringify(data.employeeList._save());
  localStorage.setItem('employeeList', elist);
};

let clearSchedule = function (id) {
  localStorage.removeItem(`schedules/${id}`);
  delete data.schedules[id];
};

let saveSchedule = function (id) {
  if (!(id in data.schedules)) { return; } // Should this throw?
  data.schedules[id]._isSaved = true;
  let sched = JSON.stringify(data.schedules[id]._save());
  localStorage.setItem(`schedules/${id}`, sched);
};

let clearSchedules = function () {
  let elist = localStorage.getItem('employeeList');
  localStorage.clear();
  data.schedules = {};
  localStorage.setItem('employeeList', elist);
};

let saveSchedules = function () {
  Object.keys(data.schedules).map(saveSchedule);
};

let loadData = function () {
  let data = {
    employeeList: null,
    schedules: {}
  };

  // load employee list
  let elist = localStorage.getItem('employeeList');
  if (elist !== null) {
    data.employeeList = elist = EmployeeList._restore(JSON.parse(elist));
  } else {
    data.employeeList = elist = new EmployeeList();
    // TODO: delete this dummy data
    let dummyEmployees = [
      elist.addEmployee('Vandell', 'test', 10000),
      elist.addEmployee('Wanda', 'test', 10),
      elist.addEmployee('Xavier', 'test', 10),
      elist.addEmployee('Yara', 'test', 10),
      elist.addEmployee('Alex', 'test', 10),
      elist.addEmployee('Brit', 'test', 10),
      elist.addEmployee('Chris', 'test', 10),
      elist.addEmployee('Drew', 'test', 10),
      elist.addEmployee('Evan', 'test', 10),
      elist.addEmployee('Frida', 'test', 10),
      elist.addEmployee('Glen', 'test', 10)
    ];

    let dummySchedules = [];
    let addDummySchedule = sched =>
      dummySchedules.push(data.schedules[sched.id] = sched);
    addDummySchedule(new Schedule(new Date()));
    addDummySchedule(new Schedule(new Date(1970, 11, 12)));

    let dummyShifts = [
      dummySchedules[0].addShift(dummyEmployees[0].id),
      dummySchedules[0].addShift(dummyEmployees[1].id),
      dummySchedules[1].addShift(dummyEmployees[2].id),
      dummySchedules[1].addShift(dummyEmployees[3].id),
      dummySchedules[1].addShift(dummyEmployees[4].id)
    ];
  }

  data.employeeList.onChange(saveEmployeeList);

  // load schedules
  let len = localStorage.length;
  for (let i = 0; i < len; i++) {
    let key = localStorage.key(i);
    let sched = localStorage.getItem(key);
    sched = JSON.parse(sched);
    if (sched.id === elist.id) { continue; }
    sched = Schedule._restore(sched);
    sched._isSaved = true;
    data.schedules[sched.id] = sched;
  }

  return data;
};

data = loadData();

app.filter('time', [
  '$locale',
  function ($locale) {
    return function (dateObject) {
      return dateObject.toLocaleString(
        $locale, { hour: 'numeric', minute: 'numeric' });
    };
  }
]);

app.factory('employeeList', [
  function () {
    return data.employeeList;
  }
]);

app.factory('schedules', [
  '$http',
  function ($http) {
    let schedules = data.schedules;
    let schedule;
    return {
      current: function () { return schedule; },
      add: function (date) {
        schedule = new Schedule(date);
        schedules[schedule.id] = schedule;
        return schedule;
      },
      clear: clearSchedule,
      save: function (id) {
        saveSchedule(id);
        let data = JSON.stringify({
          id,
          data: this.get(id)._save()
        });
        return $http.post('https://localhost:8081/schedule', data);
      },
      get: function (id) {
        let sched = schedules[id];
        schedule = sched;
        return sched;
      },
      list: function () {
        return Object.keys(schedules)
          .map(key => schedules[key])
          .sort(function (a, b) { return a.date - b.date; });
      },
      shifts: function (employeeId) {
        let list = this.list();
        let shifts = list.reduce(function (shifts, sched) {
          return shifts.concat(sched.listShifts());
        }, []);
        let matches = shifts.filter(shift => shift.employeeId === employeeId);
        return matches;
      },
      // total number of hours worked by the employee
      total: function (employeeId) {
        let shifts = this.shifts(employeeId);
        let totalMs = shifts.reduce(function (total, shift) {
          return total + (shift.endTime - shift.startTime);
        }, 0);
        return totalMs / 1000 / 60 / 60;
      },
      nextDate: function () {
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
