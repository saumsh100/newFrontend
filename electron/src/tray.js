
const { checkForUpdate } = require('./updater');

const separator = { type: 'separator' };

const quitButton = { role: 'quit' };

exports.trayMenuLoggedIn = (managerInstance) => [
  {
    label: 'Check for updates',
    click: () => checkForUpdate(),
  },
  // {
  //   label: 'Toolbar position',
  //   submenu: [
  //     {
  //       label: 'Left',
  //       click() {
  //         managerInstance.changeToolbarPosition('left');
  //       },
  //     },
  //     {
  //       label: 'Right',
  //       click() {
  //         managerInstance.changeToolbarPosition('right');
  //       },
  //     },
  //   ],
  // },
  separator,
  {
    label: 'Logout',
    click: () => managerInstance.logoutUser(),
  },
  quitButton,
];

exports.trayMenuLoggedOut = () => [
  {
    label: 'Check for updates',
    click: () => checkForUpdate(),
  },
  separator,
  quitButton,
];
