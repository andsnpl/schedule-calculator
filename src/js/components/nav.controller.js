import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('navCtrl', [
  '$rootScope',
  function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (evt, route) {
      $rootScope.route = route.originalPath;
    });
  }
]);
