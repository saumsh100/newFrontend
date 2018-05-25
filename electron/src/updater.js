
const { Notification, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('update-available', () => {
  const updateNotification = new Notification({
    title: 'New update available',
    body: 'Downloading the latest version',
  });

  updateNotification.show();
});

autoUpdater.on('update-downloaded', (event) => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'The update is ready!',
    detail: 'The update has been downloaded. It will be installed the next time you restart the application.',
  }, (response) => {
    if (response === 0) {
      setTimeout(() => autoUpdater.quitAndInstall(), 1);
      event.stopPropagation();
    }
  });
});

exports.checkForUpdate = () => {
  console.log('Checking for updates');
  autoUpdater.checkForUpdatesAndNotify();
};
