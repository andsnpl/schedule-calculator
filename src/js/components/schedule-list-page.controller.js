import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('ScheduleListPageCtrl', [
  '$scope', 'schedules',
  function ($scope, schedules) {
    $scope.schedules = schedules;

    $scope.editTarget = {
      currentSchedule: null
    };

    $scope.createSchedule = function () {
      let sched = $scope.schedules.add($scope.schedules.nextDate());
      $scope.editTarget.currentSchedule = sched;
    };

    $scope.saveSchedule = function () {
      $scope.editTarget.currentSchedule = null;
    };
  }
]);
