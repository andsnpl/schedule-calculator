import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.factory('navigateToEmployeeForm', [
  '$location',
  function ($location) {
    return function (id) {
      $location.path(`/employees/emp/${id}`);
    };
  }
]);

app.factory('employeeEditTarget', [
  function () {
    return {
      currentEmployee: null
    };
  }
]);

app.controller('EmployeeFormCtrl', [
  '$scope', '$location', '$routeParams', 'employeeList', 'employeeEditTarget',
  function ($scope, $location, $routeParams, employeeList, employeeEditTarget) {

    let closeForm = function () {
      $scope.editTarget.currentEmployee = null;
      $location.path('/employees');
    };

    let emp;
    if ($routeParams.id === 'new') {
      emp = {
        name: '',
        userId: '',
        role: '',
        payRate: 0.00
      };
    } else {
      emp = employeeList.employees[$routeParams.id];
    }
    if (!emp) { closeForm(); }

    $scope.editTarget = employeeEditTarget;
    $scope.editTarget.currentEmployee = {
      id: emp.id,
      name: emp.name || '',
      userId: emp.userId || '',
      role: emp.role || '',
      payRate: emp.payRate || 15.00
    };

    $scope.closeEmployee = closeForm;

    $scope.deleteEmployee = function (employee) {
      employeeList.deleteEmployee(employee.id);
      closeForm();
    };

    $scope.submitEmployee = function () {
      // If the currentEmployee already has an id, save to that id
      // If not, it's new data we need to add, but we still clear at the end.
      let current = $scope.editTarget.currentEmployee;
      let emp = employeeList.employees[current.id];
      if ('id' in current && emp) {
        emp.setName(current.name);
        emp.setUserId(current.userId);
        emp.setRole(current.role);
        emp.setPayRate(current.payRate);
      } else {
        employeeList.addEmployee(
          current.name, current.userId, current.role, current.payRate);
      }
      closeForm();
    };
  }
]);
