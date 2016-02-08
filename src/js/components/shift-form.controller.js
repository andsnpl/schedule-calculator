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
  '$scope', '$location', '$routeParams', 'schedule', 'shiftEditTarget',
  function ($scope, $location, $routeParams, schedule, shiftEditTarget) {

    let closeForm = function () {
      $scope.editTarget.currentShift = null;
      $location.path('/schedule');
    };
    let shift = schedule.shifts[$routeParams.id];
    if (!shift) { closeForm(); }

    $scope.editTarget = shiftEditTarget;
    $scope.editTarget.currentShift = {
      id: shift.id,
      startTime: shift.startTime,
      endTime: shift.endTime
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
