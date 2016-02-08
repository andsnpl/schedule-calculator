import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('SchedulePageCtrl', [
  '$scope', 'schedule', 'employeeList',
  'shiftEditTarget', 'navigateToShiftForm',
  function (
    $scope, schedule, employeeList, shiftEditTarget, navigateToShiftForm
  ) {
    $scope.schedule = schedule;
    $scope.employees = employeeList;

    $scope.editTarget = shiftEditTarget;
    $scope.editTarget.currentShift = null;

    let availableEmployees = function () {
      let isAvailable = function (employee) {
        return !$scope.schedule.isEmployeeWorking(employee);
      };
      return $scope.employees.listEmployees().filter(isAvailable);
    };

    $scope.$watchCollection('schedule.shifts', function () {
      $scope.availableEmployees = availableEmployees();
    });

    $scope.selectEmployee = function (emp) {
      let selected = $scope.editTarget.selectedEmployee;
      if (selected && (selected === emp.id)) {
        let shift = schedule.addShift(emp);
        $scope.editTarget.selectedEmployee = null;
        navigateToShiftForm(shift.id);
      }
    };
  }
]);
