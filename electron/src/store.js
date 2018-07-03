
const Store = require('electron-store');

module.exports = {
  userSessionStore: new Store({ name: 'userStore' }),
  applicationStore: new Store({ name: 'appStore' }),
};
