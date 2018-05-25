
const path = require('path');

const assetsDirectory = path.join(__dirname, 'assets');

module.exports = {
  appUrl: 'file:///electron_index.html',

  /** Update interval in minutes for auto checking **/
  updateInterval: 60,

  /**
   * Tray icon path
   */
  trayIcon: path.join(assetsDirectory, 'tray/icon.png'),

  /**
   * Settings of the main (login) window
   */
  mainWindow: {
    width: 1000,
    height: 800,
    show: false,
  },

  /**
   * Settings for the toolbar.
   */
  toolbar: {
    /**
     * Default toolbar position.
     *
     * enum: ['right' | 'left']
     */
    position: 'right',

    collapsedSize: 57,
    expandedSize: 410,

    toolbarWindow: {
      height: 665,
      frame: false,
      transparent: true,
      hasShadow: false,
      resizable: false,
      movable: false,
    },
  },

  /**
   * Settings for the user settings modal.
   */
  userSettings: {
    marginFromWindowBorder: 57,
    hideTimeout: 400,
    marginFromBottom: 15,

    modalWindow: {
      width: 250,
      height: 174,
      resizable: false,
      movable: false,
      hasShadow: false,
      frame: false,
      show: false,
      transparent: true,
    },
  },
};
