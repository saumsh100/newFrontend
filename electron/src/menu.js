const { checkForUpdate } = require('./updater');
const WindowManager = require('./WindowManager');
const { QUIT_APP } = require('./constants');

const helpMenu = [
  {
    label: 'Check for updates',
    click: () => checkForUpdate(true),
  },
];

const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
    ],
  },
  {
    label: 'Help',
    submenu: helpMenu,
  },
];

const aboutCareCru = [{
  label: 'About CareCru Hub',
  click: WindowManager.showAboutWindow,
}];

if (process.platform === 'darwin') {
  template.unshift({
    label: 'Carecru Hub',
    submenu: [
      ...aboutCareCru,
      { type: 'separator' },
      {
        label: QUIT_APP,
        role: 'quit',
      },
    ],
  });
} else {
  // windows related menu
  helpMenu.unshift({ type: 'separator' });
  helpMenu.unshift(...aboutCareCru);
}

exports.appMenu = template;
