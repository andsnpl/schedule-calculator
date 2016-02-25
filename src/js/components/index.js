import angular from 'angular';

import './nav.controller';
import './push.service';
import './login-page.controller';
import './schedule-list-page.controller';
import './schedule-page.controller';
import './shift-form.controller';
import './employee-page.controller';
import './employee-form.controller';
import './report-page.controller';

import loginPageTemplate from '../../templates/login-page.html';
import scheduleListPageTemplate from '../../templates/schedule-list-page.html';
import schedulePageTemplate from '../../templates/schedule-page.html';
import shiftFormTemplate from '../../templates/shift-form.html';
import employeePageTemplate from '../../templates/employee-page.html';
import employeeFormTemplate from '../../templates/employee-form.html';
import reportPageTemplate from '../../templates/report-page.html';

// custom directives
import './schedule.directive';

let app = angular.module('scheduleCalculator');

app.config([
  '$routeProvider',
  function ($routeProvider, $sce) {

    let userDataOrReroute = [
      '$location', 'userSessionData',
      function ($location, userSessionData) {
        if (userSessionData.userId === null) { $location.path('/login'); }
        return userSessionData;
      }
    ];

    let resolver = {
      userData: userDataOrReroute
    };

    $routeProvider
      .when('/login', {
        templateUrl: loginPageTemplate,
        controller: 'LoginPageCtrl as ctrl',
        resolve: resolver
      })
      .when('/schedule-list', {
        templateUrl: scheduleListPageTemplate,
        controller: 'ScheduleListPageCtrl as ctrl',
        resolve: resolver
      })
      .when('/schedule/:id', {
        templateUrl: schedulePageTemplate,
        controller: 'SchedulePageCtrl as ctrl',
        resolve: resolver
      })
      .when('/schedule/shift/:id', {
        templateUrl: shiftFormTemplate,
        controller: 'ShiftFormCtrl as ctrl',
        resolve: resolver
      })
      .when('/employees', {
        templateUrl: employeePageTemplate,
        controller: 'EmployeePageCtrl as ctrl',
        resolve: resolver
      })
      .when('/employees/emp/:id', {
        templateUrl: employeeFormTemplate,
        controller: 'EmployeeFormCtrl as ctrl',
        resolve: resolver
      })
      .when('/reports', {
        templateUrl: reportPageTemplate,
        controller: 'ReportPageCtrl as ctrl',
        resolve: resolver
      })
      .when('/reports/emp/:id?', {
        templateUrl: reportPageTemplate,
        controller: 'ReportPageCtrl as ctrl',
        resolve: resolver
      })
      .otherwise('/schedule-list');
  }
]);
