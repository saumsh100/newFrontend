
const { userSessionStore: Store } = require('../store');
const { ZOOM_FACTOR_CHANGE } = require('../constants');

class Window {
  constructor() {
    /** @type electron.BrowserWindow **/
    this.window;
  }

  /**
   * Update window scale
   */
  scaleWindow() {
    if (this.window && this.window.webContents) {
      this.notifyScale();
    }
  }

  /**
   * Send an IPC message.
   */
  notifyScale() {
    this.window.webContents.send(ZOOM_FACTOR_CHANGE, this.zoomFactor);
  }

  /**
   * close current window
   */
  close() {
    if (this.window) {
      this.window.close();
    }
  }

  /**
   * Load url on window
   */
  loadUrl() {
    if (this.url) {
      this.window.loadURL(this.url);
    }
  }

  /**
   * Set the size of the window.
   * @param width
   * @param height
   */
  setSize(width, height) {
    this.window.setSize(width, height);
  }

  /**
   * Position the window based on get xCoordinate and get yCoordinate functions.
   */
  positionWindow() {
    const x = this.xCoordinate || 0;
    const y = this.yCoordinate || 0;
    this.setCoordinates(x, y);
  }

  /**
   * Set the new coordinates of the toolbar window.
   *
   * @param x
   * @param y
   */
  setCoordinates(x = 0, y = 0) {
    this.window.setPosition(x, y);
  }

  /**
   * Center the position of window.
   */
  centerWindow() {
    this.window.center();
  }

  /**
   * Shows the window.
   */
  show() {
    this.window.show();
  }

  /**
   * Hide the window.
   */
  hide() {
    this.window.hide();
  }

  /**
   * Returns currently set zoom factor.
   *
   * @returns {number}
   */
  get zoomFactor() {
    return Store.get('toolbarSizeFactor', 1);
  }
}

module.exports = Window;
