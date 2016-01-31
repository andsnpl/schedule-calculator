describe('integration tests:', function () {
  var tester;
  beforeEach(function() {
    tester = ngMidwayTester('scheduleCalculator');
  });

  afterEach(function() {
    tester && tester.destroy();
    tester = null;
  });

  describe('employees route', function () {
    it('works', function () {
      tester.visit('/employees', function () {
        expect(tester.path()).toBe('/employees');
      });
    });

    it('adds employees', function () {
      tester.visit('/employees', function () {

      });
    });
  });
});
