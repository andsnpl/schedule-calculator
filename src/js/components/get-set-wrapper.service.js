import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.factory('GetSetWrapper', function () {
  return class GetSetWrapper {
    constructor(model, propName, setterName) {
      this.lastError = null;
      this.getterSetter = function (value) {

        let trueModel;
        if (typeof model === 'function') {
          trueModel = model();
        } else {
          trueModel = model;
        }
        if (!trueModel) { return; }

        // Called as a getter.
        if (!arguments.length) {
          return trueModel[propName];
        }

        // Called as a setter. Try using setter function. If not available just
        // set the prop directly.
        if (typeof trueModel[setterName] === 'function') {
          try {
            trueModel[setterName](value);
          } catch (err) {
            this.lastError = err;
          }
        } else {
          trueModel[propName] = value;
        }
      };
    }
  };
});
