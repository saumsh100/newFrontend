
const { BrowserWindow } = require('electron');
const url = require('url');
const { userSessionStore: Store } = require('../store');
const WindowMain = require('./Window');
const ScreenManager = require('../ScreenManager');
const config = require('../../config');
const { SET_USER_DATA } = require('../constants');

class UserModal extends WindowMain {
  constructor() {
    super();
    this.hideTimeout = false;
  }

  openWindow() {
    this.window = UserModal.createModalBrowserWindow();
    this.loadUrl();
    this.positionWindow();

    if (process.env.NODE_ENV === 'development') {
      this.window.webContents.openDevTools({ mode: 'detach' });
    }
  }

  showModal() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.show();
  }

  hideModal() {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, config.userSettings.hideTimeout);
  }

  /**
   * Send user data to the renderer process.
   *
   * @param data
   */
  notifySetUserData(data) {
    this.window.webContents.send(SET_USER_DATA, data);
  }

  /**
   * Resize user modal window
   */
  setUserModalSize() {
    const factor = this.zoomFactor;
    const { userSettings } = config;

    this.setSize(
      Math.floor(userSettings.modalWindow.width * factor),
      Math.floor(userSettings.modalWindow.height * factor),
    );
  }

  /**
   * Get the X coordinate of modal.
   * @returns {number}
   */
  get xCoordinate() {
    const toolbarPosition = Store.get('toolbarPosition', config.toolbar.position);
    const { workArea } = ScreenManager.instance.currentDisplay;
    const { userSettings } = config;

    return toolbarPosition === 'left'
      ? Math.floor(workArea.x + (config.userSettings.marginFromWindowBorder * this.zoomFactor))
      : Math.floor(workArea.x + workArea.width -
      (userSettings.marginFromWindowBorder * this.zoomFactor) -
        (userSettings.modalWindow.width * this.zoomFactor) + 7);
  }

  /**
   * Get the Y coordinate of modal.
   *
   * @returns {number}
   */
  get yCoordinate() {
    const { toolbar, userSettings } = config;
    const { workArea } = ScreenManager.instance.currentDisplay;

    const coordinate =
      workArea.y +
      workArea.height / 2 +
      (toolbar.toolbarWindow.height / 2 -
      userSettings.modalWindow.height -
      userSettings.marginFromBottom) * this.zoomFactor;

    return Math.floor(coordinate);
  }

  /**
   * Get the default url of browser window
   *
   * @returns {string}
   */
  get url() {
    return url.format({
      pathname: 'electron_user.html',
      protocol: 'file:',
      slashes: true,
    });
  }

  /**
   * Creates a new instance of modal.
   *
   * @returns {Electron.BrowserWindow}
   */
  static createModalBrowserWindow() {
    return new BrowserWindow(config.userSettings.modalWindow);
  }
}

module.exports = UserModal;
