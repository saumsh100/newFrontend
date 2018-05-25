
const electron = require('electron');
const MainBrowserWindow = require('./Windows/MainWindow');
const UserModalWindow = require('./Windows/UserModal');
const Store = require('./store');
const config = require('../config');
const TrayManager = require('./TrayManager');
const { LOGOUT_REQUEST } = require('./constants');

const BrowserWindow = electron.BrowserWindow;

let instance = null;

class WindowManager {
  constructor() {
    this.isAuth = false;
    this.mainWindow = new MainBrowserWindow();
    this.userModalWindow = new UserModalWindow();
    this.createMainBrowserWindow();
    this.mainWindow.loadUrl();
    TrayManager.instance.showLoggedOutTray();
  }

  /**
   * Toggle the toolbar/loginWindow visibility.
   */
  toggleToolbar() {
    this.isAuth ? this.showToolbar() : this.showLoginWindow();
  }

  /**
   * displays the toolbar window.
   */
  showToolbar() {
    this.mainWindow.hide();
    this.createToolbarBrowserWindow();
    this.mainWindow.setToolbarSize();
    this.mainWindow.positionWindow();
    this.userModalWindow.openWindow();
    this.userModalWindow.positionWindow();
    TrayManager.instance.showLoggedInTray(this);

    this.userModalWindow.window.on('hide', () => {
      this.mainWindow.notifyUserManagementWindowClosed();
    });
  }

  /**
   * displays the login window.
   */
  showLoginWindow() {
    this.createMainBrowserWindow();
    this.mainWindow.setLoginWindowSize();
    this.mainWindow.setLoginWindowPosition();
    this.userModalWindow.close();
  }

  /**
   * Changes the toolbar position to left/right
   *
   * @param newPosition
   */
  changeToolbarPosition(newPosition) {
    Store.set('toolbarPosition', newPosition);
    this.mainWindow.changeState(true);
    this.mainWindow.positionWindow();
    this.mainWindow.setToolbarSize();
    this.mainWindow.notifyPositionChange();
    this.userModalWindow.positionWindow();
  }

  /**
   * Logout the current user.
   */
  logoutUser() {
    this.auth = false;
    this.mainWindow.window.webContents.send(LOGOUT_REQUEST);
    Store.clear();
    clearTimeout(this.userModalWindow.hideTimeout);
    this.toggleToolbar();
    TrayManager.instance.showLoggedOutTray();
  }

  /**
   * create instance of main window
   */
  createMainBrowserWindow() {
    const window = new BrowserWindow(config.mainWindow);
    this.closeCurrentWindow();
    return this.mainWindow.setWindow(window);
  }

  /**
   * create instance of toolbar window
   */
  createToolbarBrowserWindow() {
    const window = new BrowserWindow(config.toolbar.toolbarWindow);
    this.closeCurrentWindow();
    return this.mainWindow.setWindow(window);
  }

  /**
   * Close the current window instance
   */
  closeCurrentWindow() {
    if (this.mainWindow.window) {
      this.mainWindow.window.close();
    }
  }

  /**
   * Set the current user to the user modal.
   *
   * @param data
   */
  setUser(data) {
    this.userModalWindow.notifySetUserData(data);
  }

  /**
   * Show User modal window.
   */
  showUserModal() {
    this.mainWindow.window.setAlwaysOnTop(true);
    this.userModalWindow.window.setAlwaysOnTop(true);
    this.userModalWindow.showModal();
    this.userModalWindow.window.once('hide', () => {
      this.mainWindow.window.setAlwaysOnTop(false);
      this.userModalWindow.window.setAlwaysOnTop(true);
    });
  }

  /**
   * Hide User modal window.
   */
  hideUserModal() {
    this.userModalWindow.hideModal();
  }

  /**
   * Set auth value.
   *
   * @param value
   */
  set auth(value) {
    this.isAuth = value;
  }

  /**
   * Get the instance of window helper.
   *
   * @returns {WindowManager}
   */
  static get instance() {
    if (!instance) {
      instance = new WindowManager();
    }
    return instance;
  }
}

module.exports = WindowManager;
