import angular from 'angular';

import './nav.controller';
import './edit-target.service';
import './schedule-page.controller';
import './shift-form.controller';
import './employee-page.controller';

import schedulePageTemplate from '../../templates/schedule-page.html';
import shiftFormTemplate from '../../templates/shift-form.html';
import employeePageTemplate from '../../templates/employee-page.html';

// custom directives
import './schedule.directive';

let app = angular.module('scheduleCalculator');

app.config([
  '$routeProvider',
  function ($routeProvider, $sce) {
    $routeProvider
      .when('/schedule', {
        templateUrl: schedulePageTemplate,
        controller: 'SchedulePageCtrl as ctrl'
      })
      .when('/schedule/shift/:id', {
        templateUrl: shiftFormTemplate,
        controller: 'ShiftFormCtrl as ctrl'
      })
      .when('/employees', {
        templateUrl: employeePageTemplate,
        controller: 'EmployeePageCtrl as ctrl'
      })
      .otherwise('/schedule');
  }
]);
