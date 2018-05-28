
const { ipcMain, app, shell } = require('electron');
const {
  APP_VERSION_REQUEST,
  APP_VERSION_RESPONSE,
  RESIZE_WINDOW,
  SHOW_TOOLBAR,
  SHOW_CONTENT,
  HIDE_USER_MODAL,
  SHOW_USER_MODAL,
  LOGOUT_REQUEST,
  SET_USER_DATA,
  OPEN_EXTERNAL_LINK,
  REQUEST_USER_DATA,
  REQUEST_TOOLBAR_POSITION,
} = require('./constants');
const WindowManager = require('./WindowManager');

ipcMain.on(APP_VERSION_REQUEST, (event) => {
  event.sender.send(APP_VERSION_RESPONSE, app.getVersion());
});

ipcMain.on(SHOW_TOOLBAR, (event, data) => {
  const window = WindowManager.instance;
  if (data.isAuth === window.isAuth) {
    return;
  }
  window.auth = data.isAuth;
  window.toggleToolbar();
  window.setUser(data.user);
});

ipcMain.on(RESIZE_WINDOW, (event, data) => {
  const window = WindowManager.instance;
  const { expanded } = data;

  window.mainWindow.changeState(!expanded);
  window.mainWindow.setToolbarPosition();
  window.mainWindow.setToolbarSize();

  if (expanded) {
    event.sender.send(SHOW_CONTENT);
  }
});

ipcMain.on(SHOW_USER_MODAL, () => {
  WindowManager.instance.showUserModal();
});

ipcMain.on(HIDE_USER_MODAL, () => {
  WindowManager.instance.hideUserModal();
});

ipcMain.on(LOGOUT_REQUEST, () => {
  WindowManager.instance.logoutUser();
});

ipcMain.on(SET_USER_DATA, (e, data) => {
  WindowManager.instance.setUser(data);
});

ipcMain.on(OPEN_EXTERNAL_LINK, (e, link) => {
  shell.openExternal(link);
});

ipcMain.on(REQUEST_USER_DATA, () => {
  setTimeout(() => {
    WindowManager.instance.mainWindow.notifyRequestUser();
  }, 4000);
});

ipcMain.on(SET_USER_DATA, (e, data) => {
  WindowManager.instance.setUser(data);
});

ipcMain.on(REQUEST_TOOLBAR_POSITION, () => {
  WindowManager.instance.mainWindow.notifyPositionChange();
});