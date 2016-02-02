import angular from 'angular';
import './get-set-wrapper.service';

let app = angular.module('scheduleCalculator');

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList', 'GetSetWrapper',
  function ($scope, employeeList, GetSetWrapper) {
    $scope.employees = employeeList;
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

    $scope.submit = function () {
      // If the currentEmployee already has an id, just clear currentEmployee
      // If not, it's new data we need to add, but we still clear at the end.
      let current = $scope.editing.currentEmployee;
      if (!('id' in current)) {
        employeeList.addEmployee(current.name, current.role, current.payRate);
      }
      $scope.editing.currentEmployee = {};
    };

    $scope.$on('delete-item', function (evt, whichItem) {
      employeeList.deleteEmployee(whichItem.id);
    });
  }
]);
