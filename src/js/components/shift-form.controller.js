import angular from 'angular';
import './get-set-wrapper.service';

let app = angular.module('scheduleCalculator');

app.factory('navigateToShiftForm', [
  '$location',
  function ($location) {
    return function (id) {
      $location.path(`/schedule/shift/${id}`);
    };
  }
]);

app.controller('ShiftFormCtrl', [
  '$scope', '$location', 'schedule', 'shiftEditTarget',
  function ($scope, $location, schedule, shiftEditTarget) {
    $scope.editTarget = shiftEditTarget;

    let closeForm = function () {
      $scope.editTarget.currentShift = null;
      $location.path('/schedule');
    };

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
