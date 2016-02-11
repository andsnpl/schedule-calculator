import angular from 'angular';

import './nav.controller';
import './schedule-list-page.controller';
import './schedule-page.controller';
import './shift-form.controller';
import './employee-page.controller';
import './employee-form.controller';

import scheduleListPageTemplate from '../../templates/schedule-list-page.html';
import schedulePageTemplate from '../../templates/schedule-page.html';
import shiftFormTemplate from '../../templates/shift-form.html';
import employeePageTemplate from '../../templates/employee-page.html';
import employeeFormTemplate from '../../templates/employee-form.html';

// custom directives
import './schedule.directive';

let app = angular.module('scheduleCalculator');

app.config([
  '$routeProvider',
  function ($routeProvider, $sce) {
    $routeProvider
      .when('/schedule-list', {
        templateUrl: scheduleListPageTemplate,
        controller: 'ScheduleListPageCtrl as ctrl'
      })
      .when('/schedule/:id', {
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
      .when('/employees/emp/:id', {
        templateUrl: employeeFormTemplate,
        controller: 'EmployeeFormCtrl as ctrl'
      })
      .otherwise('/schedule-list');
  }
]);
