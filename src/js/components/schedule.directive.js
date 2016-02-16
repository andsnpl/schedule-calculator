import angular from 'angular';

import scheduleTemplate from '../../templates/schedule.html';

let app = angular.module('scheduleCalculator');

app.directive('schedule', [
  'navigateToShiftForm', 'employeeList',
  function (navigateToShiftForm, employeeList) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: scheduleTemplate,
      scope: {
        schedule: '=model',
        editTarget: '='
      },
      link: function (scope, element, attrs) {
        scope.$watchCollection('schedule.shifts', function () {
          scope.shifts = scope.schedule.listShifts();
          scope.employees = scope.shifts
            .map(shift => employeeList.employees[shift.employeeId]);
        });

        scope.$watchGroup(
          ['schedule.openTime', 'schedule.closeTime'],
          function (newValues) {
            let first = newValues[0].getHours();
            let last = newValues[1].getHours() + 1;
            let hours = [];
            for (var i = first; i < last; i++) {
              let d = new Date();
              d.setMilliseconds(0);
              d.setSeconds(0);
              d.setMinutes(0);
              d.setHours(i);
              hours.push(d);
            }
            scope.hours = hours;
            scope.pctOfDayPerHour = 1 / (last - first) * 100;
          }
        );

        scope.selectShift = function(id) {
          let shift = scope.schedule.shifts[id];
          if (!shift) {
            scope.editTarget.currentShift = null;
          } else {
            navigateToShiftForm(id);
          }
        };

        scope.$watch('editTarget.currentShift.id', scope.selectShift);

        // Allows the template to request a class definition used for responsive
        // styling.
        scope.hoursCountAsClassObject = function () {
          if (!scope.hours) { return {}; }
          return {
            ['hourscount-' + scope.hours.length]: true
          };
        };
      }
    };
  }
]);
