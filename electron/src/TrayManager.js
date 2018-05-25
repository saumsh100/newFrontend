
const { Menu, Tray } = require('electron');
const { trayIcon } = require('../config');
const { trayMenuLoggedIn, trayMenuLoggedOut } = require('./tray');

let instance = null;

class TrayManager {
  constructor() {
    this.tray = new Tray(trayIcon);
  }

  /**
   * Show Logged in tray menu.
   */
  showLoggedInTray(managerInstance) {
    const loggedInTray = Menu.buildFromTemplate(trayMenuLoggedIn(managerInstance));
    this.tray.setContextMenu(loggedInTray);
  }

  /**
   * Show Logged out tray menu.
   */
  showLoggedOutTray() {
    const loggedOutTray = Menu.buildFromTemplate(trayMenuLoggedOut());
    this.tray.setContextMenu(loggedOutTray);
  }

  /**
   * Get the instance of tray manager.
   *
   * @returns {TrayManager}
   */
  static get instance() {
    if (!instance) {
      instance = new TrayManager();
    }
    return instance;
  }
}

module.exports = TrayManager;
