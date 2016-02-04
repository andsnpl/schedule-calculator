import angular from 'angular';
import './get-set-wrapper.service';

let app = angular.module('scheduleCalculator');

app.controller('SchedulePageCtrl', [
  '$scope', 'schedule', 'employeeList', 'GetSetWrapper',
  function ($scope, schedule, employeeList, GetSetWrapper) {
    $scope.schedule = schedule;
    $scope.employees = employeeList;

    $scope.editing = {
      currentShift: null,
      selectedEmployee: null
    };
    $scope.editing_startTime = new GetSetWrapper(
      function () { return $scope.editing.currentShift; },
      'startTime', 'setStartTime'
    );
    $scope.editing_length = new GetSetWrapper(
      function () { return $scope.editing.currentShift; },
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

    $scope.submitShift = function () {
      $scope.editing.currentShift
        = schedule.addShift($scope.editing.selectedEmployee);
      $scope.editing.selectedEmployee = null;
    };
  }
]);
