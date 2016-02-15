import angular from 'angular';
import 'angular-route';
import 'angular-animate';

let app = angular.module('scheduleCalculator', [
  'ngRoute', 'ngAnimate'
]);

app.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);
