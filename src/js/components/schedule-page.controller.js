import angular from 'angular';
import './get-set-wrapper.service';

let app = angular.module('scheduleCalculator');

app.controller('SchedulePageCtrl', [
  '$scope', 'schedule', 'employeeList', 'GetSetWrapper',
  function ($scope, schedule, employeeList, GetSetWrapper) {
    $scope.schedule = schedule;
    $scope.employees = employeeList;

    $scope.editTarget = {
      currentShift: null,
      selectedEmployee: null
    };

    let availableEmployees = function () {
      let isAvailable = function (employee) {
        return !$scope.schedule.isEmployeeWorking(employee);
      };
      return $scope.employees.listEmployees().filter(isAvailable);
    };

    $scope.$watchCollection('schedule.shifts', function () {
      $scope.availableEmployees = availableEmployees();
    });


    $scope.selectEmployee = function (emp) {
      let selected = $scope.editTarget.selectedEmployee;
      if (selected && (selected === emp.id)) {
        $scope.editTarget = {
          currentShift: schedule.addShift(emp).id,
          selectedEmployee: null
        };
      }
    };

    $scope.closeShift = function () {
      $scope.editTarget.currentShift = null;
    };

    $scope.deleteShift = function (shift) {
      schedule.deleteShift(shift.id);
      $scope.editTarget.currentShift = null;
    };

    $scope.submitShift = function () {
      let current = $scope.editTarget.currentShift;
      let shift = current && schedule.shifts[current.id];
      if (!shift) { return; }
      shift.setStartTime(current.startTime);
      shift.setEndTime(current.endTime);
      console.log('still here', shift);
      $scope.editTarget.currentShift = null;
    };
  }
]);
