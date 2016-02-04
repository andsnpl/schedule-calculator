import angular from 'angular';
import './get-set-wrapper.service';

let app = angular.module('scheduleCalculator');

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList', 'GetSetWrapper',
  function ($scope, employeeList, GetSetWrapper) {
    $scope.employeeList = employeeList;

    $scope.editing = {
      currentEmployee: {}
    };

    $scope.editing_name = new GetSetWrapper(
      function () { return $scope.editing.currentEmployee; },
      'name', 'setName'
    );

    $scope.editing_role = new GetSetWrapper(
      function () { return $scope.editing.currentEmployee; },
      'role', 'setRole'
    );

    $scope.editing_payRate = new GetSetWrapper(
      function () { return $scope.editing.currentEmployee; },
      'payRate', 'setPayRate'
    );

    let getEmployees = function () {
      return employeeList.listEmployees()
        .sort(function (a, b) { return b.id - a.id; });
    };
    $scope.employees = getEmployees();
    $scope.$watchCollection('employeeList.employees', function () {
      let idx = $scope.employees.indexOf($scope.editing.currentEmployee);
      // Don't select where none is already selected.
      idx < 0 && (idx = NaN);
      $scope.employees = getEmployees();

      let nextIdx = Math.min(idx, $scope.employees.length);
      $scope.editing.currentEmployee = $scope.employees[nextIdx];
    });

    $scope.submitEmployee = function () {
      // If the currentEmployee already has an id, just clear currentEmployee
      // If not, it's new data we need to add, but we still clear at the end.
      let current = $scope.editing.currentEmployee;
      if (!('id' in current)) {
        employeeList.addEmployee(current.name, current.role, current.payRate);
      }
      $scope.editing.currentEmployee = {};
    };

    $scope.deleteEmployee = function (employee, $event) {
      $event.preventDefault();
      employeeList.deleteEmployee(employee.id);
    };
  }
]);
