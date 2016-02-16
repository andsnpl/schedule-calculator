import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('pushCtrl', [
  '$scope', '$http', 'pushNotifications',
  function ($scope, $http, pushNotifications) {
    $scope.prompt = parseInt(localStorage.getItem('promptToPush'));
    isNaN($scope.prompt) && ($scope.prompt = pushNotifications.supported);
    $scope.allow = function () {
      localStorage.setItem('promptToPush', '0');
      $scope.prompt = 0;
      pushNotifications.subscribe();
    };
    $scope.deny = function () {
      localStorage.setItem('promptToPush', '0');
      $scope.prompt = 0;
    };
  }
]);
