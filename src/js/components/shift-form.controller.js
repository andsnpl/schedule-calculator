import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.factory('navigateToShiftForm', [
  '$location',
  function ($location) {
    return function (id) {
      $location.path(`/schedule/shift/${id}`);
    };
  }
]);

app.factory('shiftEditTarget', [
  function () {
    return {
      currentShift: null,
      selectedEmployee: null
    };
  }
]);

app.controller('ShiftFormCtrl', [
  '$scope', '$location', '$routeParams', 'schedules', 'shiftEditTarget',
  function ($scope, $location, $routeParams, schedules, shiftEditTarget) {
    let schedule = schedules.current();
    $scope.editTarget = shiftEditTarget;

    let closeForm = function () {
      $scope.editTarget.currentShift = null;
      $location.path(`/schedule/${schedule.id}`);
    };
    let shift = schedule.shifts[$routeParams.id];
    if (!shift) { closeForm(); }

    $scope.editTarget.currentShift = {
      id: shift.id,
      startTime: shift.startTime,
      endTime: shift.endTime
    };

    let startingLength = (shift.endTime - shift.startTime) / 1000 / 60 / 60;
    let startingHours = schedules.total(shift.employeeId) - startingLength;
    $scope.$watchGroup(
      ['editTarget.currentShift.startTime', 'editTarget.currentShift.endTime'],
      function (_, oldValues) {
        let current = $scope.editTarget.currentShift;
        if (!current) { return; }
        if (current.startTime >= current.endTime) {
          [current.startTime, current.endTime] = oldValues;
          return;
        }
        let lengthMs = current.endTime - current.startTime;
        let length = lengthMs / 1000 / 60 / 60;
        $scope.length = length;
        $scope.hoursWorked = startingHours  + length;
      }
    );

    $scope.closeShift = closeForm;

    $scope.deleteShift = function (shift) {
      schedule.deleteShift(shift.id);
      closeForm();
    };

    $scope.submitShift = function () {
      let current = $scope.editTarget.currentShift;
      let shift = current && schedule.shifts[current.id];
      if (!shift) { return; }
      shift.setStartTime(current.startTime);
      shift.setEndTime(current.endTime);
      closeForm();
    };
  }
]);
