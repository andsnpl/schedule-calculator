import angular from 'angular';
import { EmployeeList, Schedule } from './core';

let app = angular.module('scheduleCalculator');

let employeeList = new EmployeeList();
let schedules = {};

// TODO: delete this dummy data
let dummySchedules = [];
let addDummySchedule = sched =>
  dummySchedules.push(schedules[sched.id] = sched);
addDummySchedule(new Schedule(new Date()));
addDummySchedule(new Schedule(new Date(1970, 11, 12)));
let dummyEmployees = [
  employeeList.addEmployee('Vandell', 'test', 10000),
  employeeList.addEmployee('Wanda', 'test', 10),
  employeeList.addEmployee('Xavier', 'test', 10),
  employeeList.addEmployee('Yara', 'test', 10),
  employeeList.addEmployee('Alex', 'test', 10),
  employeeList.addEmployee('Brit', 'test', 10),
  employeeList.addEmployee('Chris', 'test', 10),
  employeeList.addEmployee('Drew', 'test', 10),
  employeeList.addEmployee('Evan', 'test', 10),
  employeeList.addEmployee('Frida', 'test', 10),
  employeeList.addEmployee('Glen', 'test', 10)
];
let dummyShifts = [
  dummySchedules[0].addShift(dummyEmployees[0]),
  dummySchedules[0].addShift(dummyEmployees[1]),
  dummySchedules[1].addShift(dummyEmployees[2]),
  dummySchedules[1].addShift(dummyEmployees[3]),
  dummySchedules[1].addShift(dummyEmployees[4])
];

app.filter('time', [
  '$locale',
  function ($locale) {
    return function (dateObject) {
      return dateObject.toLocaleString(
        $locale, { hour: 'numeric', minute: 'numeric' });
    };
  }
]);

app.factory('employeeList', function () {
  return employeeList;
});

app.factory('schedules', function () {
  let schedule;
  return {
    current: function () { return schedule; },
    add: function (date) {
      schedule = new Schedule(date);
      schedules[schedule.id] = schedule;
      return schedule;
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
      let matches = shifts.filter(shift => shift.employee.id === employeeId);
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
});
