import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList', 'employeeEditTarget', 'navigateToEmployeeForm',
  function ($scope, employeeList, employeeEditTarget, navigateToEmployeeForm) {
    $scope.employeeList = employeeList;

    $scope.editTarget = employeeEditTarget;
    $scope.editTarget.currentEmployee = null;

    let getEmployees = function () {
      return employeeList.listEmployees()
        .sort(function (a, b) { return b.id - a.id; });
    };
    $scope.employees = getEmployees();
    $scope.$watchCollection('employeeList.employees', function () {
      $scope.employees = getEmployees();
    });

    $scope.editEmployee = navigateToEmployeeForm;
  }
]);
