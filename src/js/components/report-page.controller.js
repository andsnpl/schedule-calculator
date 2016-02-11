import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('ReportPageCtrl', [
  '$scope', 'schedules',
  function ($scope, schedules) {
    $scope.schedule = schedules.current();
  }
]);
