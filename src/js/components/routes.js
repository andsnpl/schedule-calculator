import app from '../schedule-calculator';
import './get-set-wrapper.service';

import schedulePageTemplate from '../../templates/schedule-page.html';
// custom directives used in schedule page template
import './schedule.directive';
import './slider.directive';

import employeePageTemplate from '../../templates/employee-page.html';
// custom directives used in the employee page template
import './delete-button.directive';

app.config([
  '$routeProvider',
  function ($routeProvider, $sce) {
    $routeProvider
      .when('/', {
        templateUrl: schedulePageTemplate,
        controller: 'SchedulePageCtrl as ctrl'
      })
      .when('/employees', {
        templateUrl: employeePageTemplate,
        controller: 'EmployeePageCtrl as ctrl'
      })
      .otherwise('/');
  }
]);

app.controller('SchedulePageCtrl', [
  '$scope', 'schedule', 'employeeList', 'GetSetWrapper',
  function ($scope, schedule, employeeList, GetSetWrapper) {
    $scope.schedule = schedule;
    $scope.employees = employeeList;

    $scope.editing = {
      currentShift: null
    };
    $scope.editing_startTime = new GetSetWrapper(
      function () { return $scope.editing.currentShift; },
      'startTime', 'setStartTime'
    );
    $scope.editing_length = new GetSetWrapper(
      function () { return $scope.editing.currentShift; },
      'length', 'setLength'
    );

    let availableEmployees = function () {
      let isAvailable = function (employee) {
        return !$scope.schedule.isEmployeeWorking(employee);
      };
      return $scope.employees.listEmployees().filter(isAvailable);
    };

    $scope.$watchCollection('schedule.shifts', function () {
      $scope.availableEmployees = availableEmployees();
    });

    // TODO: remove this dummy code
    $scope.add = {
      emp: employeeList.addEmployee('Vandell', 'test', 10)
    };
    employeeList.addEmployee('Wanda', 'test', 10);
    employeeList.addEmployee('Xavier', 'test', 10);
    employeeList.addEmployee('Yara', 'test', 10);

    let added = employeeList.addEmployee('Zane', 'test', 10);
    $scope.editing.currentShift = schedule.addShift(added);
  }
]);

app.controller('EmployeePageCtrl', [
  '$scope', 'employeeList', 'GetSetWrapper',
  function ($scope, employeeList, GetSetWrapper) {
    $scope.employees = employeeList;
    $scope.editing = {
      currentEmployee: {}
    };

    $scope.editing_name = new GetSetWrapper(
      function () { return $scope.editing.currentEmployee; },
      'name', 'setName'
    );

    $scope.editing_role = new GetSetWrapper(
      function () { return $scope.editing.currentEmployee; },
      'role', 'setRole'
    );

    $scope.editing_payRate = new GetSetWrapper(
      function () { return $scope.editing.currentEmployee; },
      'payRate', 'setPayRate'
    );

    $scope.submit = function () {
      // If the currentEmployee already has an id, just clear currentEmployee
      // If not, it's new data we need to add, but we still clear at the end.
      let current = $scope.editing.currentEmployee;
      if (!('id' in current)) {
        employeeList.addEmployee(current.name, current.role, current.payRate);
      }
      $scope.editing.currentEmployee = {};
    };

    $scope.$on('delete-item', function (evt, whichItem) {
      employeeList.deleteEmployee(whichItem.id);
    });

    // TODO delete this dummy data
    employeeList.addEmployee('Alex', 'test', 10);
    employeeList.addEmployee('Brit', 'test', 10);
    employeeList.addEmployee('Chris', 'test', 10);
    employeeList.addEmployee('Drew', 'test', 10);
    employeeList.addEmployee('Evan', 'test', 10);
    employeeList.addEmployee('Frida', 'test', 10);
    employeeList.addEmployee('Glen', 'test', 10);
  }
]);

app.controller('ReportPageCtrl', [
  '$scope', 'schedule',
  function ($scope, schedule) {
    $scope.schedule = schedule;
  }
]);
