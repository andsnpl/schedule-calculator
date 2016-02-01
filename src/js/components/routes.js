import app from '../schedule-calculator';
import './get-set-wrapper.service';

import schedulePageTemplate from '../../templates/schedule-page.html';
// custom directives used in schedule page template
import './schedule.directive';
import './slider.directive';

import employeePageTemplate from '../../templates/employee-page.html';

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

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList',
  function ($scope, employeeList) {
    $scope.employees = employeeList;

    // TODO deletet this dummy data
    employeeList.addEmployee('Alex', 'test', 10);
    employeeList.addEmployee('Brit', 'test', 10);
    employeeList.addEmployee('Chris', 'test', 10);
    employeeList.addEmployee('Drew', 'test', 10);
    employeeList.addEmployee('Evan', 'test', 10);
    employeeList.addEmployee('Frida', 'test', 10);
    employeeList.addEmployee('Glen', 'test', 10);
  }
]);

app.controller('SchedulePageCtrl', [
  '$scope', 'schedule', 'employeeList', 'GetSetWrapper',
  function ($scope, schedule, employeeList, GetSetWrapper) {
    $scope.schedule = schedule;
    $scope.employees = employeeList;

    $scope.editing = null;
    $scope.editing_startTime = new GetSetWrapper(
      function () { return $scope.editing; },
      'startTime', 'setStartTime'
    );
    $scope.editing_length = new GetSetWrapper(
      function () { return $scope.editing; },
      'length', 'setLength'
    );

    let availableEmployees = function () {
      let isAvailable = function (employee) {
        return !$scope.schedule.isEmployeeWorking(employee);
      };
      return $scope.employees.listEmployees().filter(isAvailable);
    };

    $scope.$watchCollection('schedule.shifts', function () {
      $scope.availableEmployees = availableEmployees();
    });

    // TODO: remove this dummy code
    $scope.add = {
      emp: employeeList.addEmployee('test', 'test', 10)
    };
    employeeList.addEmployee('test2', 'test', 10);
    employeeList.addEmployee('test3', 'test', 10);
    employeeList.addEmployee('test4', 'test', 10);

    let added = employeeList.addEmployee('test5', 'test', 10);
    $scope.editing = schedule.addShift(added);
  }
]);

app.controller('ReportPageCtrl', [
  '$scope', 'schedule',
  function ($scope, schedule) {
    $scope.schedule = schedule;
  }
]);
