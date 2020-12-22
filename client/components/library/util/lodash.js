
export const isFunction = value => typeof value === 'function';

export const pick = (obj, values) => {
  const newObj = {};
  [...values].forEach((value) => {
    if (obj[value]) {
      newObj[value] = obj[value];
    }
  });
  return newObj;
};

export const omit = (obj, values) => {
  const newObj = { ...obj };
  [...values].forEach((value) => {
    if (newObj[value]) {
      delete newObj[value];
    }
  });
  return newObj;
};

export const isArray = value => Array.isArray(value);

export const clone = (value) => {
  const cloneObj = obj => (typeof obj === 'object' ? { ...obj } : obj);
  return isArray(value) ? [...value] : cloneObj(value);
};

export const forEach = (value, callback) => {
  if (Array.isArray(value) || value instanceof Map) {
    return value.forEach(callback);
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return keys.forEach(key => callback(value[key]));
  }
  throw new Error('Using forEach is not possible for this variable');
};
