import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.directive('deleteButton', [
  function () {
    return {
      restrict: 'A',
      template: '&times;',
      scope: {
        deletableItem: '=deleteButton'
      },
      link: function (scope, element, attrs) {
        element.addClass('delete-buton');
        element.on('click', function () {
          scope.$emit('delete-item', scope.deletableItem);
        });
      }
    };
  }
]);
