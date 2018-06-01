
const url = require('url');
const config = require('../../config');
const Store = require('../store');
const WindowMain = require('./Window');
const { TOOLBAR_POSITION_CHANGE, HIDDEN_USER_MODAL, REQUEST_USER_DATA } = require('../constants');

const EXPANDED_SIZE = config.toolbar.expandedSize;
const COLLAPSED_SIZE = config.toolbar.collapsedSize;
const PROTOCOL = 'file';
const ENTRY_FILE = 'electron_index.html';

class MainBrowserWindow extends WindowMain {
  constructor() {
    super();
    this.isCollapsed = true;
  }

  /**
   * Trigger the position change of toolbar according to the default config or
   * user settings.
   */
  setToolbarPosition() {
    this.positionWindow();
  }

  /**
   * Resize toolbar window
   */
  setToolbarSize() {
    const toolbarWidth = this.isCollapsed ? COLLAPSED_SIZE : EXPANDED_SIZE;
    this.setSize(toolbarWidth, config.toolbar.toolbarWindow.height);
  }

  /**
   * Set the position of login window
   */
  setLoginWindowPosition() {
    this.centerWindow();
  }

  /**
   * Set size of the main window
   */
  setLoginWindowSize() {
    this.setSize(config.mainWindow.width, config.mainWindow.height);
  }

  /**
   * Change toolbar state.
   *
   * @param state
   */
  changeState(state) {
    if (this.isCollapsed === state) {
      return;
    }
    this.isCollapsed = state;
  }

  /**
   * Notify the render window about position change.
   */
  notifyPositionChange() {
    const position = Store.get('toolbarPosition', config.toolbar.position);
    this.window.webContents.send(TOOLBAR_POSITION_CHANGE, position);
  }

  /**
   * Notify the render window that user data is requiered.
   */
  notifyRequestUser() {
    this.window.webContents.send(REQUEST_USER_DATA);
  }

  /**
   * Notify the render window that user management window
   * has closed.
   */
  notifyUserManagementWindowClosed() {
    this.window.webContents.send(HIDDEN_USER_MODAL);
  }

  /**
   * Set the new Window element
   *
   * @param newWindow
   */
  setWindow(newWindow) {
    this.window = newWindow;

    if (process.env.NODE_ENV === 'development') {
      this.window.webContents.openDevTools({ mode: 'detach' });
    }

    this.loadUrl();
  }

  /**
   * Get the X coordinate of window.
   * @returns {number}
   */
  get xCoordinate() {
    const { size } = this.primaryScreen;
    const toolbarSize = this.isCollapsed ? COLLAPSED_SIZE : EXPANDED_SIZE;
    return Store.get('toolbarPosition', config.toolbar.position) === 'left'
      ? 0
      : size.width - toolbarSize;
  }

  /**
   * Get the Y coordinate of window.
   * @returns {number}
   */
  get yCoordinate() {
    const toolbarHeight = config.toolbar.toolbarWindow.height;
    const { size } = this.primaryScreen;

    const coordinate = (size.height / 2) - (toolbarHeight / 2);
    return Math.floor(coordinate);
  }

  /**
   * Get the default url of browser window
   *
   * @returns {string}
   */
  get url() {
    return url.format({
      pathname: ENTRY_FILE,
      protocol: `${PROTOCOL}:`,
      slashes: true,
    });
  }
}

module.exports = MainBrowserWindow;
