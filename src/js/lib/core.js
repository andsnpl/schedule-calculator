import {
  createId, addChangeEvents, mapCollection, isCompatibleTime, addHours
} from './utils';

// Allows any object with a _validate() method to test altering a prop before
// committing to the change.
let _setPossiblyInvalidProp = function (obj, propName, value) {
  let mock = Object.create(obj);
  mock[propName] = value;
  if (!mock._validate) {
    throw new Error(`Invalid ${propName}`);
  }
  obj[propName] = value;
};

// assumes a homogenous collection having the _save() method
let _saveCollection = function (coll) {
  return mapCollection(obj => obj._save(), coll);
};

// assumes a homogenous collection restoreable by Cls._restore()
let _restoreCollection = function (coll, Cls) {
  return mapCollection(obj => Cls._restore(obj), coll);
};

export class Shift {
  constructor (employeeId, startTime, endTime, scheduleId) {
    this.employeeId = employeeId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.scheduleId = scheduleId;
    this.id = createId();
    if (!this._validate()) {
      throw new Error('Invalid parameters for Shift.');
    }
  }
  _validate() {
           // must have integer id
    return typeof this.id === 'number' && this.id % 1 === 0
           // must have valid employeeId
        && typeof this.employeeId === 'number' && this.employeeId % 1 === 0
           // must have start and end times on the same date, compatible with
           // angular's inputs
        && isCompatibleTime(this.startTime)
        && isCompatibleTime(this.endTime)
           // startTime must be < endTime
        && this.startTime < this.endTime;
  }
  _save() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      startTime: this.startTime.toUTCString(),
      endTime: this.endTime.toUTCString(),
      scheduleId: this.scheduleId
    };
  }
  static _restore(contents) {
    let start = new Date(contents.startTime);
    let end = new Date(contents.endTime);
    let shift = new Shift(contents.employeeId, start, end, contents.scheduleId);
    shift.id = createId._restoreId(contents.id);
    return shift;
  }
  setStartTime(time) {
    _setPossiblyInvalidProp(this, 'startTime', time);
    return this;
  }
  setEndTime(time) {
    _setPossiblyInvalidProp(this, 'endTime', time);
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
    this.date = date;
    this.openTime = new Date(1970, 0, 1, 0, 0, 0, 0);
    this.closeTime = new Date(1970, 0, 1, 23, 59, 0, 0);
    this.id = createId();
    this.shifts = {};
  }
  _save() {
    return {
      id: this.id,
      date: this.date.toUTCString(),
      openTime: this.openTime.toUTCString(),
      closeTime: this.closeTime.toUTCString(),
      shifts: _saveCollection(this.shifts)
    };
  }
  static _restore(contents) {
    let date = new Date(contents.date);
    let sched = new Schedule(date);
    sched.id = createId._restoreId(contents.id);
    sched.openTime = new Date(contents.openTime);
    sched.closeTime = new Date(contents.closeTime);
    sched.shifts = _restoreCollection(contents.shifts, Shift);
    return sched;
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
  addShift(employeeId) {
    if (this.isEmployeeWorking(employeeId)) {
      throw new Error('Cannot add the same employee twice.');
    }
    let startTime = this.openTime;
    let length = 8;
    let endTime = addHours(startTime, length);
    let shiftObj = new Shift(employeeId, startTime, endTime, this.id);
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
    for (let key of Object.keys(this.shifts)) {
      shifts.push(this.shifts[key]);
    }
    return shifts;
  }
  isEmployeeWorking(employeeId) {
    for (let key of Object.keys(this.shifts)) {
      if (this.shifts[key].employeeId === employeeId) {
        return true;
      }
    }
    return false;
  }
}

export class Employee {
  constructor (name, userId, role, payRate) {
    this.name = name;
    this.userId = userId;
    this.role = role;
    this.payRate = payRate;
    this.id = createId();
    addChangeEvents(this);
    if (!this._validate()) {
      throw new Error('Invalid parameters for Employee.');
    }
  }
  _validate() {
           // must have integer id
    return typeof this.id === 'number' && this.id % 1 === 0
           // must have string name
        && typeof this.name === 'string'
           // must have string user id
        && typeof this.userId === 'string'
           // must have string role
        && typeof this.role === 'string'
           // must have numeric payRate > 0
        // && typeof this.payRate === 'number' && this.payRate > 0;
  }
  _save() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
      role: this.role,
      payRate: this.payRate
    };
  }
  static _restore(contents) {
    let emp = new Employee(
      contents.name, contents.userId, contents.role, contents.payRate);
    emp.id = createId._restoreId(contents.id);
    return emp;
  }
  setName(name) {
    _setPossiblyInvalidProp(this, 'name', name);
    this.change();
    return this;
  }
  setUserId(userId) {
    _setPossiblyInvalidProp(this, 'userId', userId);
    this.change();
    return this;
  }
  setRole(role) {
    _setPossiblyInvalidProp(this, 'role', role);
    this.change();
    return this;
  }
  setPayRate(rate) {
    _setPossiblyInvalidProp(this, 'payRate', rate);
    this.change();
    return this;
  }
}

export class EmployeeList {
  constructor () {
    this.id = createId();
    this.employees = {};
    addChangeEvents(this);
  }
  _save() {
    return {
      id: this.id,
      employees: _saveCollection(this.employees)
    };
  }
  static _restore(contents) {
    let elist = new EmployeeList();
    elist.id = createId._restoreId(contents.id);
    elist.employees = _restoreCollection(contents.employees, Employee);
    for (let key of Object.keys(elist.employees)) {
      let emp = elist.employees[key];
      emp.onChange(() => elist.change());
    }
    return elist;
  }
  addEmployee (name, role, payRate) {
    let emp = new Employee(name, role, payRate);
    this.employees[emp.id] = emp;
    this.change();
    emp.onChange(() => this.change()); // this = employee list
    return emp;
  }
  deleteEmployee (employeeId) {
    delete this.employees[employeeId];
    this.change();
  }
  listEmployees () {
    let emps = [];
    for (let key of Object.keys(this.employees)) {
      emps.push(this.employees[key]);
    }
    return emps;
  }
}
