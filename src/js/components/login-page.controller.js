import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('LoginPageCtrl', [
  '$scope', '$location', 'userSessionData', 'pushNotifications',
  function ($scope, $location, userSessionData, pushNotifications) {
    $scope.form = {
      userId: userSessionData.userId,
      receivePush: false
    };

    $scope.saveUserId = function () {
      let redirect = function () {
        $location.path('/schedule-list');
      };
      userSessionData.saveUserId($scope.form.userId);
      userSessionData.sync().then(redirect, redirect);
      if ($scope.form.receivePush) {
        pushNotifications.subscribe(userSessionData.userId);
      }
    };
  }
]);
