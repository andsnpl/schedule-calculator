import angular from 'angular';
import './get-set-wrapper.service';

let app = angular.module('scheduleCalculator');

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList', 'GetSetWrapper',
  function ($scope, employeeList, GetSetWrapper) {
    $scope.employeeList = employeeList;

    let resetEditTarget = function () {
      $scope.editTarget = {
        currentEmployee: null
      };
    };
    resetEditTarget();

    let getEmployees = function () {
      return employeeList.listEmployees()
        .sort(function (a, b) { return b.id - a.id; });
    };
    $scope.employees = getEmployees();
    $scope.$watchCollection('employeeList.employees', function () {
      $scope.employees = getEmployees();
    });

    $scope.addNewEmployee = function () {
      $scope.editTarget = {
        currentEmployee: {
          name: '',
          role: '',
          payRate: 0.00
        }
      };
    };

    $scope.submitEmployee = function () {
      // If the currentEmployee already has an id, save to that id
      // If not, it's new data we need to add, but we still clear at the end.
      let current = $scope.editTarget.currentEmployee;
      let emp = employeeList.employees[current.id];
      if (!('id' in current && emp)) {
        employeeList.addEmployee(current.name, current.role, current.payRate);
      } else {
        emp.setName(current.name);
        emp.setRole(current.role);
        emp.setPayRate(current.payRate);
      }
      resetEditTarget();
    };

    $scope.closeEmployee = resetEditTarget;

    $scope.editEmployee = function (employee) {
      $scope.editTarget = {
        currentEmployee: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
          payRate: employee.payRate
        }
      };
    };

    $scope.deleteEmployee = function (employee) {
      employeeList.deleteEmployee(employee.id);
      resetEditTarget();
    };
  }
]);
