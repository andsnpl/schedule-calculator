import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.factory('shiftEditTarget', [
  function () {
    return {
      currentShift: null,
      selectedEmployee: null
    };
  }
]);

app.factory('employeeEditTarget', [
  function () {
    return {
      currentEmployee: null
    };
  }
]);
