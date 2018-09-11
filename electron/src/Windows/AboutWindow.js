
const { BrowserWindow } = require('electron');
const url = require('url');
const WindowMain = require('./Window');
const { aboutWindowSettings } = require('../../config');

class AboutWindow extends WindowMain {
  /**
   * Shows about window when its ready.
   */
  showWhenReady() {
    if (this.window) {
      return this.window.focus();
    }

    this.window = new BrowserWindow(aboutWindowSettings);
    this.loadUrl();

    this.window.once('ready-to-show', () => {
      this.show();
    });

    if (process.env.NODE_ENV === 'development') {
      this.window.webContents.openDevTools({ mode: 'detach' });
    }

    this.window.setMenuBarVisibility(false);

    this.window.once('closed', () => {
      this.window = null;
    });

    return this.window;
  }

  /**
   * Get the default url of browser window
   *
   * @returns {string}
   */
  get url() {
    return url.format({
      pathname: 'electron_about.html',
      protocol: 'file:',
      slashes: true,
    });
  }
}

module.exports = new AboutWindow();
