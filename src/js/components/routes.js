import app from '../schedule-calculator';
import './get-set-wrapper.service';

import schedulePageTemplate from '../../templates/schedule-page.html';
// custom directives used in schedule page
import './schedule.directive';

app.config([
  '$routeProvider',
  function ($routeProvider, $sce) {
    $routeProvider
      .when('/', {
        templateUrl: schedulePageTemplate,
        controller: 'SchedulePageCtrl as ctrl'
      })
      .otherwise('/');
  }
]);

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList',
  function ($scope, employeeList) {
    $scope.employees = employeeList;
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

    $scope.add = {
      emp: employeeList.addEmployee('test', 'test', 10)
    };
    employeeList.addEmployee('test2', 'test', 10);
    employeeList.addEmployee('test3', 'test', 10);
    employeeList.addEmployee('test4', 'test', 10);
    employeeList.addEmployee('test5', 'test', 10);
  }
]);

app.controller('ReportPageCtrl', [
  '$scope', 'schedule',
  function ($scope, schedule) {
    $scope.schedule = schedule;
  }
]);
