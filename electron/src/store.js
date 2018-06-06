
const Store = require('electron-store');
const store = new Store();

exports.set = (key, value) => {
  store.set(key, value);
};

exports.get = (key, defaultValue = null) => store.get(key, defaultValue);

exports.clear = () => {
  store.clear();
};
