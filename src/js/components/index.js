import angular from 'angular';

import './schedule-page.controller';
import './employee-page.controller';

import schedulePageTemplate from '../../templates/schedule-page.html';
import employeePageTemplate from '../../templates/employee-page.html';

// custom directives
import './schedule.directive';
import './slider.directive';

let app = angular.module('scheduleCalculator');

app.config([
  '$routeProvider',
  function ($routeProvider, $sce) {
    $routeProvider
      .when('/', {
        templateUrl: schedulePageTemplate,
        controller: 'SchedulePageCtrl as ctrl'
      })
      .when('/employees', {
        templateUrl: employeePageTemplate,
        controller: 'EmployeePageCtrl as ctrl'
      })
      .otherwise('/');
  }
]);
