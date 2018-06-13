
const electron = require('electron');
const Store = require('./store');

let instance = null;

class ScreenManager {
  constructor() {
    this.manager = null;
    this.validateDisplayList();
    this.registerEventListeners();
  }

  /**
   * Register event listeners for display adding/removing.
   */
  registerEventListeners() {
    electron.screen.on('display-removed', (e, removedDisplay) => {
      if (removedDisplay.id === this.currentDisplay.id) {
        this.resetToPrimaryDisplay();
        if (this.manager) {
          this.manager.resetTray();
          this.manager.mainWindow.positionWindow();
          this.manager.userModalWindow.positionWindow();
        }
      }
    });
    electron.screen.on('display-added', () => {
      if (this.manager) {
        this.manager.resetTray();
      }
    });
  }

  /**
   * Validate the list of displays to ensure that the one that is in config actually exist.
   */
  validateDisplayList() {
    const displays = electron.screen.getAllDisplays();

    if (!this.currentDisplay) {
      this.resetToPrimaryDisplay();
    }

    const foundDisplay = displays.find(display => display.id === this.currentDisplay.id);

    if (!foundDisplay) {
      this.resetToPrimaryDisplay();
    }
  }

  /**
   * Reset screen settings to the primary display.
   */
  resetToPrimaryDisplay() {
    this.currentDisplay = electron.screen.getPrimaryDisplay();
  }

  /**
   * Get the currently used display.
   *
   * @returns {*}
   */
  get currentDisplay() {
    return Store.get('toolbarDisplay');
  }

  /**
   * Set new display
   *
   * @param display
   */
  set currentDisplay(display) {
    Store.set('toolbarDisplay', display);
  }

  /**
   * Set window manager instance.
   *
   * @param manager
   */
  set windowManager(manager) {
    this.manager = manager;
  }

  /**
   * Get the instance of window helper.
   *
   * @returns {WindowManager}
   */
  static get instance() {
    if (!instance) {
      instance = new ScreenManager();
    }
    return instance;
  }
}

module.exports = ScreenManager;
