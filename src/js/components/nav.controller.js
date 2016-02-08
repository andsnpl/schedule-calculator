import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('navController', [
  '$rootScope',
  function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (evt, route) {
      $rootScope.route = route.originalPath;
    });
  }
]);
