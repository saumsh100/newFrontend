const { checkForUpdate } = require('./updater');
const { QUIT_APP } = require('./constants');

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
    submenu: [
      {
        label: 'Check for updates',
        click: () => checkForUpdate(),
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: 'Carecru Hub',
    submenu: [
      {
        label: QUIT_APP,
        role: 'quit',
      },
    ],
  });
}

exports.appMenu = template;
