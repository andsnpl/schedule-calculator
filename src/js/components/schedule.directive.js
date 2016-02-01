import app from '../schedule-calculator';

import scheduleTemplate from '../../templates/schedule.html';

app.directive('schedule', function () {
  return {
    restrict: 'E',
    templateUrl: scheduleTemplate,
    scope: {
      schedule: '=model'
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
          let first = Math.floor(newValues[0]);
          let last = Math.ceil(newValues[1]);
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