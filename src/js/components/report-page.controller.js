import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('ReportPageCtrl', [
  '$scope', 'schedules', 'employeeList',
  function ($scope, schedules, employeeList) {
    $scope.schedules = schedules;
    $scope.employees = employeeList.listEmployees();

    $scope.selection = {
      employee: $scope.employees.length ? $scope.employees[0].id : null
    };
  }
]);
