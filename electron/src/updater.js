
const { Notification, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const { applicationStore: Store } = require('./store');
const { getChannelFromVersion } = require('./util');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

if (process.env.NODE_ENV !== 'development') {
  const persistedChannel = Store.get('updateChannel');

  if (!persistedChannel) {
    const extractedChannel = getChannelFromVersion(autoUpdater.currentVersion);
    Store.set('updateChannel', extractedChannel);
  }

  autoUpdater.channel = Store.get('updateChannel');
  log.info(`Update channel set to: ${autoUpdater.channel}`);
}


autoUpdater.on('update-available', () => {
  const updateNotification = new Notification({
    title: 'New update available',
    body: 'Downloading the latest version',
  });

  updateNotification.show();
});

autoUpdater.on('error', (error) => {
  log.info(`Error in auto updater: ${error}.`);
});

autoUpdater.on('download-progress', ({ percent }) => {
  log.info(`Auto update progress ${Math.floor(percent)}%`);
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'The update is ready!',
    detail: 'The update has been downloaded. It will be installed the next time you restart the application.',
  }, (response) => {
    if (response === 0) {
      setTimeout(() => autoUpdater.quitAndInstall(), 1);
    }
  });
});

exports.checkForUpdate = () => {
  console.log('Checking for updates');
  autoUpdater.checkForUpdatesAndNotify();
};
