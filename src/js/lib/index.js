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

app.factory('schedule', function () {
  // TODO: delete this dummy data
  let schedule = new Schedule();
  schedule._dummy = schedule.addShift({
    id: 99,
    name: 'Zane',
    role: 'test',
    payRate: 10
  });
  schedule.addShift({
    id: 98,
    name: 'Zane',
    role: 'test',
    payRate: 10
  });
  schedule.addShift({
    id: 97,
    name: 'Zane',
    role: 'test',
    payRate: 10
  });
  schedule.addShift({
    id: 96,
    name: 'Zane',
    role: 'test',
    payRate: 10
  });
  schedule.addShift({
    id: 95,
    name: 'Zane',
    role: 'test',
    payRate: 10
  });
  return schedule;
});
