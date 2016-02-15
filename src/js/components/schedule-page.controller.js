import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.controller('SchedulePageCtrl', [
  '$scope', '$routeParams', 'schedules', 'employeeList',
  'shiftEditTarget', 'navigateToShiftForm',
  function (
    $scope, $routeParams, schedules, employeeList,
    shiftEditTarget, navigateToShiftForm
  ) {
    let scheduleId = $routeParams.id;
    $scope.schedule = schedules.get(scheduleId);
    $scope.employees = employeeList;

    $scope.editTarget = shiftEditTarget;
    $scope.editTarget.currentShift = null;

    let availableEmployees = function () {
      let isAvailable = function (employee) {
        return !$scope.schedule.isEmployeeWorking(employee.id);
      };
      return $scope.employees.listEmployees().filter(isAvailable);
    };

    $scope.$watchCollection('schedule.shifts', function () {
      $scope.availableEmployees = availableEmployees();
      $scope.hoursWorked = $scope.availableEmployees.map(function (employee) {
        return schedules.total(employee.id);
      });
    });

    $scope.selectEmployee = function (emp) {
      let selected = $scope.editTarget.selectedEmployee;
      if (selected && (selected === emp.id)) {
        let shift = $scope.schedule.addShift(selected);
        $scope.editTarget.selectedEmployee = null;
        navigateToShiftForm(shift.id);
      }
    };

    $scope.save = function () {
      schedules.save(scheduleId);
    };

    $scope.close = function () {
      if (!$scope.schedule._isSaved) {
        schedules.clear(scheduleId);
      }
    };
  }
]);
