let createId = (function () {
  let nextId = 100;
  return function createId() {
    return nextId++;
  };
}());

let isCompatibleTime = function (time) {
  if (!(time instanceof Date)) { return false; }
  let year = time.getFullYear();
  let month = time.getMonth();
  let day = time.getDate();
  return year === 1970
      && month === 0
      && day === 1;
};

// Adds hours but keeps the year/month/day the same;
let addHours = function (time, n) {
  time = new Date(time);
  let year = time.getFullYear();
  let month = time.getMonth();
  let day = time.getDate();
  let hours = time.getHours() + n;
  time.setHours(hours);
  time.setFullYear(year);
  time.setMonth(month);
  time.setDate(day);
  return time;
};

let validateShift = function (shift) {
         // must have integer id
  return typeof shift.id === 'number' && shift.id % 1 === 0
         // must have valid employeeId
      && typeof shift.employee.id === 'number' && shift.employee.id % 1 === 0
         // must have start and end times on the same date, compatible with
         // angular's inputs
      && isCompatibleTime(shift.startTime)
      && isCompatibleTime(shift.endTime)
         // startTime must be < endTime
      && shift.startTime < shift.endTime;
};

let validateEmployee = function (emp) {
         // must have integer id
  return typeof emp.id === 'number' && emp.id % 1 === 0
         // must have string name
      && typeof emp.name === 'string'
         // must have string role
      && typeof emp.role === 'string'
         // must have numeric payRate > 0
      && typeof emp.payRate === 'number' && emp.payRate > 0;
};

export class Shift {
  constructor (employee, startTime, endTime) {
    this.employee = employee;
    this.startTime = startTime;
    this.endTime = endTime;
    this.id = createId();
    if (!validateShift(this)) {
      throw new Error('Invalid parameters for Shift.');
    }
  }
  _setPossiblyInvalidProp(propName, value) {
    let mock = Object.create(this);
    mock[propName] = value;
    if (!validateShift(mock)) {
      throw new Error(`Invalid ${propName}`);
    }
    this[propName] = value;
  }
  setStartTime(time) {
    this._setPossiblyInvalidProp('startTime', time);
    return this;
  }
  setEndTime(time) {
    this._setPossiblyInvalidProp('endTime', time);
    return this;
  }
  length() {
    return (this.endTime - this.startTime) / 1000 / 60 / 60;
  }
  startOffset(relativeTo) {
    return (this.startTime - relativeTo) / 1000 / 60 / 60;
  }
}

export class Schedule {
  constructor (date) {
    this.openTime = new Date(1970, 0, 1, 0, 0, 0, 0);
    this.closeTime = new Date(1970, 0, 1, 23, 59, 0, 0);
    this.date = date;
    this.id = createId();
    this.shifts = {};
  }
  setOpenTime(time) {
    if (isNaN(time) || time >= 24 || time < 0) {
      throw new Error('Invalid open time.');
    }
    this.openTime = time;
  }
  setCloseTime(time) {
    if (isNaN(time) || time > 24 || time <= 0) {
      throw new Error('Invalid close time.');
    }
    this.closeTime = time;
  }
  addShift(employee) {
    if (this.isEmployeeWorking(employee)) {
      throw new Error('Cannot add the same employee twice.');
    }
    let startTime = this.openTime;
    let length = 8;
    let endTime = addHours(startTime, length);
    let shiftObj = new Shift(employee, startTime, endTime);
    this.shifts[shiftObj.id] = shiftObj;
    return shiftObj;
  }
  setShiftStart(shiftId, time) {
    return this.shifts[shiftId].setStartTime(time);
  }
  setShiftLength(shiftId, length) {
    return this.shifts[shiftId].setLength(length);
  }
  deleteShift(shiftId) {
    delete this.shifts[shiftId];
  }
  listShifts() {
    let shifts = [];
    let keys = Object.keys(this.shifts);
    let len = keys.length;
    for (let i = 0; i < len; i++) {
      shifts.push(this.shifts[keys[i]]);
    }
    return shifts;
  }
  isEmployeeWorking(employee) {
    let keys = Object.keys(this.shifts);
    let len = keys.length;
    for (let i = 0; i < len; i++) {
      if (this.shifts[keys[i]].employee.id === employee.id) {
        return true;
      }
    }
    return false;
  }
}

export class Employee {
  constructor (name, role, payRate) {
    this.name = name;
    this.role = role;
    this.payRate = payRate;
    this.id = createId();
    if (!validateEmployee(this)) {
      throw new Error('Invalid parameters for Employee.');
    }
  }
  _setPossiblyInvalidProp(propName, value) {
    let mock = Object.create(this);
    mock[propName] = value;
    if (!validateEmployee(mock)) {
      throw new Error(`Invalid ${propName}`);
    }
    this[propName] = value;
  }
  setName(name) {
    this._setPossiblyInvalidProp('name', name);
    return this;
  }
  setRole(role) {
    this._setPossiblyInvalidProp('role', role);
    return this;
  }
  setPayRate(rate) {
    this._setPossiblyInvalidProp('payRate', rate);
    return this;
  }
}

export class EmployeeList {
  constructor () {
    this.employees = {};
  }
  addEmployee (name, role, payRate) {
    let emp = new Employee(name, role, payRate);
    this.employees[emp.id] = emp;
    return emp;
  }
  deleteEmployee (employeeId) {
    delete this.employees[employeeId];
  }
  listEmployees () {
    let emps = [];
    let keys = Object.keys(this.employees);
    let len = keys.length;
    for (let i = 0; i < len; i++) {
      emps.push(this.employees[keys[i]]);
    }
    return emps;
  }
}
