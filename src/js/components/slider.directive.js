import app from '../schedule-calculator';

import sliderTemplate from '../../templates/slider.html';

app.directive('slider', [
  '$document', '$rootScope',
  function ($document, $rootScope) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        model: '=?',
        getterSetter: '=?',
        dim: '@'
      },
      templateUrl: sliderTemplate,
      link: function (scope, element, attrs) {
        let elt = element[0];
        let min = scope.$eval(attrs.min) || 0;
        let max = scope.$eval(attrs.max) || 1;
        let scale = max - min;
        let dimProps = scope.dim === 'y'
          ? { size: 'clientHeight',
              position: 'offsetTop',
              offset: 'top',
              location: 'clientY' }
          : { size: 'clientWidth',
              position: 'offsetLeft',
              offset: 'left',
              location: 'clientX' };

        let getEventLocation = function (evt) {
          let position = elt[dimProps.position];
          let size = elt[dimProps.size];
          let eventAbsLocation = evt[dimProps.location];
          return Math.max(min,
                 Math.min(max,
                   (eventAbsLocation - position) * scale / size
                 ) );
        };

        let setModelValue = function (value) {
          if (scope.model !== undefined) {
            scope.model = value;
          }

          if (typeof scope.getterSetter === 'function') {
            scope.getterSetter(value);
          }

          $rootScope.$digest();
        };

        let active = false;
        element.on('mousedown touchstart', function (evt) {
          active = true;
          setModelValue(getEventLocation(evt));
        });

        $document.on('mousemove touchmove', function (evt) {
          if (!active) { return; }
          setModelValue(getEventLocation(evt));
        });

        $document.on('mouseup touchend mouseleave touchleave', function (evt) {
          active = false;
        });

        scope.$watch('model', function (value) {
          scope[dimProps.offset] = value / scale;
        });

        scope.$watch('getterSetter()', function (value) {
          scope[dimProps.offset] = value / scale;
        });
      }
    };
  }
]);
