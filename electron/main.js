
const { app, protocol, Menu } = require('electron');
const path = require('path');
const config = require('./config');
const log = require('electron-log');
const { checkForUpdate } = require('./src/updater');
const { appMenu } = require('./src/menu');
const WindowManager = require('./src/WindowManager');
require('./src/ipc');

let mainWindow = null;

function createWindow() {
  const WEB_FOLDER = process.env.NODE_ENV === 'development' ? '../statics' : './';
  const PROTOCOL = 'file';
  const ENTRY_FILE = 'electron_index.html';
  const EMPTY_ROUTE = 'file:///';
  const DEFAULT_ROUTE = `${PROTOCOL}://${ENTRY_FILE}`;

  protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    let requestUrl = request.url.substr(PROTOCOL.length + 1);

    requestUrl = path.join(__dirname, WEB_FOLDER, requestUrl);
    requestUrl = path.normalize(requestUrl);
    let hash = null;

    if (requestUrl.indexOf('#') !== -1) {
      const splittedUrl = requestUrl.split('#');
      hash = splittedUrl[splittedUrl.length - 1];
      requestUrl = splittedUrl[0];
    }

    log.info('REQUESTED FILE: ', requestUrl);

    callback({
      path: requestUrl !== EMPTY_ROUTE ? requestUrl : DEFAULT_ROUTE,
      hash,
    });
  });

  const windowHelper = WindowManager.instance;

  mainWindow = windowHelper.mainWindow.window;

  const menuFromTemplate = Menu.buildFromTemplate(appMenu);
  Menu.setApplicationMenu(menuFromTemplate);

  createWindowListeners();
  if (process.env.NODE_ENV === 'development') {
    updateChecker();
  }
}

function createWindowListeners() {
  const windowHelper = WindowManager.instance;

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    if (!windowHelper.mainWindow.window) {
      mainWindow = null;
      return;
    }
    mainWindow = windowHelper.mainWindow.window;
    createWindowListeners();
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
}

if (mainWindow) {
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.focus();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Run update check every hour.
 */
const updateChecker = () => {
  checkForUpdate();
  setTimeout(() => {
    updateChecker();
  }, 1000 * 60 * config.updateInterval);
};
