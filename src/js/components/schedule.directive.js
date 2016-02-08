import angular from 'angular';

import scheduleTemplate from '../../templates/schedule.html';

let app = angular.module('scheduleCalculator');

app.directive('schedule', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: scheduleTemplate,
    scope: {
      schedule: '=model',
      editTarget: '='
    },
    link: function (scope, element, attrs) {
      scope.shifts = scope.schedule.listShifts();
      scope.hours = [];
      scope.pctOfDayPerHour = 100;

      scope.$watchCollection('schedule.shifts', function () {
        scope.shifts = scope.schedule.listShifts();
      });

      scope.$watchGroup(
        ['schedule.openTime', 'schedule.closeTime'],
        function (newValues) {
          let first = newValues[0].getHours();
          let last = newValues[1].getHours();
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

      scope.$watch('editTarget.currentShift.id', function (id) {
        let shift = scope.schedule.shifts[id];
        if (!shift) {
          scope.editTarget.currentShift = null;
        } else {
          scope.editTarget.currentShift = {
            id: id,
            startTime: shift.startTime,
            endTime: shift.endTime
          };
        }
      });

      // Allows the template to request a class definition used for responsive
      // styling.
      scope.hoursCountAsClassObject = function () {
        return {
          ['hourscount-' + scope.hours.length]: true
        };
      };
    }
  };
});
