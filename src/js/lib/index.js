import angular from 'angular';
import { EmployeeList, Schedule } from './core';

let app = angular.module('scheduleCalculator');

app.factory('employeeList', function () {
  let employeeList = new EmployeeList();
  // TODO: delete this dummy data
  employeeList._dummy = [
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
  return employeeList;
});

app.factory('schedules', function () {
  // TODO: delete this dummy data
  let schedule = new Schedule(Date.now());
  let schedule2 = new Schedule(new Date(1970, 11, 12));
  schedule._dummy = schedule.addShift({
    id: 99,
    name: 'Zane',
    role: 'test',
    payRate: 10
  });
  schedule.addShift({
    id: 98,
    name: 'George',
    role: 'test',
    payRate: 10
  });
  schedule.addShift({
    id: 97,
    name: 'Harriet',
    role: 'test',
    payRate: 10
  });
  schedule2.addShift({
    id: 96,
    name: 'Indra',
    role: 'test',
    payRate: 10
  });
  schedule2.addShift({
    id: 95,
    name: 'Jim',
    role: 'test',
    payRate: 10
  });
  let schedules = {
    [schedule.id]: schedule,
    [schedule2.id]: schedule2
  };
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
      return this.list()
        .reduce(function (shifts, sched) {
          return shifts.concat(sched.listShifts());
        }, [])
        .filter(sched => sched.employee.id === employeeId);
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
