
const url = require('url');
const config = require('../../config');
const Store = require('../store');
const WindowMain = require('./Window');
const ScreenManager = require('../ScreenManager');
const {
  TOOLBAR_POSITION_CHANGE,
  HIDDEN_USER_MODAL,
  REQUEST_USER_DATA,
} = require('../constants');

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
    const factor = this.zoomFactor;
    const toolbarWidth = this.isCollapsed ? COLLAPSED_SIZE : EXPANDED_SIZE;

    this.setSize(
      Math.floor(toolbarWidth * factor),
      Math.floor(config.toolbar.toolbarWindow.height * factor)
    );
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
    const { workArea } = ScreenManager.instance.currentDisplay;
    const toolbarSize = this.isCollapsed ? COLLAPSED_SIZE : EXPANDED_SIZE;
    return Store.get('toolbarPosition', config.toolbar.position) === 'left'
      ? workArea.x
      : workArea.width - toolbarSize + workArea.x;
  }

  /**
   * Get the Y coordinate of window.
   * @returns {number}
   */
  get yCoordinate() {
    const toolbarHeight = Store.get('toolbarSizeFactor', 1) * config.toolbar.toolbarWindow.height;
    const { workArea } = ScreenManager.instance.currentDisplay;

    const halfWorkAreaHeight = workArea.height / 2;
    const halfToolbarHeight = toolbarHeight / 2;

    const coordinate = halfWorkAreaHeight - halfToolbarHeight + workArea.y;
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
