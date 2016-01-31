
import angular from 'angular';
import 'angular-route';
import 'angular-animate';

import { EmployeeList, Schedule } from './lib/core';

let app = angular.module('scheduleCalculator', [
  'ngRoute', 'ngAnimate'
]);

app.factory('employeeList', function () {
  return new EmployeeList();
});

app.factory('schedule', function () {
  return new Schedule();
});

export default app;
