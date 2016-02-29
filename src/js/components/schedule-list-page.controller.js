import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('ScheduleListPageCtrl', [
  '$scope', '$location', 'schedules',
  function ($scope, $location, schedules) {
    console.log('schedule page control');
    $scope.schedules = schedules;

    $scope.editTarget = {
      currentSchedule: null
    };

    $scope.createSchedule = function () {
      let sched = $scope.schedules.add($scope.schedules.nextDate());
      $scope.editTarget.currentSchedule = sched;
    };

    $scope.saveSchedule = function () {
      let id = $scope.editTarget.currentSchedule.id;
      $scope.editTarget.currentSchedule = null;
      $location.path(`/schedule/${id}`);
    };
  }
]);
