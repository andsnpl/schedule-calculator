import app from '../schedule-calculator';

app.factory('GetSetWrapper', function () {
  return class GetSetWrapper {
    constructor(model, propName, setterName) {
      this.lastError = null;
      this.getterSetter = function (value) {
        console.log(`invoking getterSetter with ${arguments.length} arguments`);
        let trueModel;
        if (typeof model === 'function') {
          trueModel = model();
        } else {
          trueModel = model;
        }
        if (!trueModel) { return; }
        if (!arguments.length) {
          return trueModel[propName];
        }
        try {
          trueModel[setterName](value);
        } catch (err) {
          this.lastError = err;
        }
      };
    }
  };
});
