import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('ReportPageCtrl', [
  '$scope', 'schedule',
  function ($scope, schedule) {
    $scope.schedule = schedule;
  }
]);
