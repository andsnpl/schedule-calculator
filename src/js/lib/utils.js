export let createId = (function () {
  let nextId = 100;
  let createId = function () {
    return nextId++;
  };
  createId._restoreId = function (newId) {
    nextId = Math.max(nextId, newId) + 1;
    return newId;
  };
  return createId;
}());

export let addChangeEvents = function (obj) {
  let listeners = [];
  obj.change = function () { listeners.forEach(l => l.call(obj)); };
  obj.onChange = function (l) { listeners.push(l); };
};

export let mapCollection = function (f, coll) {
  if (typeof coll !== 'object') {
    throw new Error(`Cannot create matching collection for ${typeof coll}`);
  }
  let newColl = coll instanceof Array ? [] : {};
  for (let key of Object.keys(coll)) {
    newColl[key] = f(coll[key]);
  }
  return newColl;
};

// Checks if the time is compatible with Angular's time input field
export let isCompatibleTime = function (time) {
  if (!(time instanceof Date)) { return false; }
  let year = time.getFullYear();
  let month = time.getMonth();
  let day = time.getDate();
  return year === 1970
      && month === 0
      && day === 1;
};

// Adds hours but keeps the year/month/day the same;
export let addHours = function (time, n) {
  time = new Date(time);
  time.setHours(
    (((time.getHours() + n) % 24) + 24) % 24
  );
  return time;
};
