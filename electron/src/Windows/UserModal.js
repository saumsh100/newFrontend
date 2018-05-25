
const { BrowserWindow } = require('electron');
const url = require('url');
const Store = require('../store');
const WindowMain = require('./Window');
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
   * Get the X coordinate of modal.
   * @returns {number}
   */
  get xCoordinate() {
    const toolbarPosition = Store.get('toolbarPosition');
    const { size } = this.primaryScreen;
    const { userSettings } = config;

    return toolbarPosition === 'left'
      ? config.userSettings.marginFromWindowBorder
      : size.width - userSettings.marginFromWindowBorder - userSettings.modalWindow.width + 7;
  }

  /**
   * Get the Y coordinate of modal.
   *
   * @returns {number}
   */
  get yCoordinate() {
    const { toolbar, userSettings } = config;
    const { size } = this.primaryScreen;

    const coordinate =
      size.height / 2 +
      toolbar.toolbarWindow.height / 2 -
      userSettings.modalWindow.height -
      userSettings.marginFromBottom;

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
