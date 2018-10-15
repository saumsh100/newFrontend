
const os = require('os');
const url = require('url');
const robot = require('robotjs');
const config = require('../../config');
const { userSessionStore: Store } = require('../store');
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
    this.mousePositionCheckerTimeout = null;
    this.mousePositionFocusChecks = 0;
  }

  /**
   * Trigger the position change of toolbar according to the default config or
   * user settings.
   * @param setDelay {boolean}
   */
  setToolbarPosition(setDelay) {
    this.positionWindow(setDelay);
  }

  /**
   * Resize toolbar window
   */
  setToolbarSize() {
    const factor = this.zoomFactor;
    const toolbarWidth = this.isCollapsed ? COLLAPSED_SIZE : EXPANDED_SIZE;

    this.setSize(
      Math.floor(toolbarWidth * factor),
      Math.floor(config.toolbar.toolbarWindow.height * factor),
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
   * Registers a timeout function that periodically checks if mouse is within the
   * toolbar zone when application is blurred.
   */
  registerMousePositionChecker() {
    this.mousePositionCheckerTimeout = setTimeout(() => {
      const mousePosition = robot.getMousePos();
      if (this.isCursorWithinToolbarZone(mousePosition)) {
        this.mousePositionFocusChecks += 1;
      }

      // As timeout is 500 and we want to focus the app on 1500ms, we are waiting for 3 checks
      return this.mousePositionFocusChecks === 3 ?
        this.focusApp() : this.registerMousePositionChecker();
    }, 500);
  }

  /**
   * Cancels the blur checker timeout. (window is focused)
   */
  cancelMousePositionChecker() {
    if (this.mousePositionCheckerTimeout) {
      clearTimeout(this.mousePositionCheckerTimeout);
    }
  }

  /**
   * Check if cursor is within the toolbar zone.
   * @param cursor {{x, y}} Current position of the cursor
   * @return {boolean}
   */
  isCursorWithinToolbarZone(cursor) {
    const bounds = this.window.getBounds();

    return cursor.x >= bounds.x && cursor.x <= bounds.x + (COLLAPSED_SIZE * this.zoomFactor)
      && cursor.y >= bounds.y && cursor.y <= bounds.y + bounds.height;
  }

  /**
   * Focus the app and clear blur checks.
   */
  focusApp() {
    this.mousePositionFocusChecks = 0;
    if (os.platform() !== 'darwin') {
      this.window.setAlwaysOnTop(true);
    }
    this.window.focus();
    if (os.platform() !== 'darwin') {
      this.window.setAlwaysOnTop(false);
    }
  }

  /**
   * Get the X coordinate of window.
   * @returns {number}
   */
  get xCoordinate() {
    const { workArea } = ScreenManager.instance.currentDisplay;
    const bounds = this.window.getBounds();

    return Store.get('toolbarPosition', config.toolbar.position) === 'left'
      ? workArea.x
      : workArea.width - bounds.width + workArea.x;
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

  /**
   * Callback that runs on application blur.
   * @param toolbarWindow {MainBrowserWindow}
   * @returns {Function}
   */
  static onBlurCallback(toolbarWindow) {
    return () => {
      toolbarWindow.registerMousePositionChecker();
    };
  }

  /**
   * Callback that runs when application is focused.
   * @param toolbarWindow {MainBrowserWindow}
   * @returns {Function}
   */
  static onFocusCallback(toolbarWindow) {
    return () => {
      toolbarWindow.cancelMousePositionChecker();
    };
  }
}

module.exports = MainBrowserWindow;
