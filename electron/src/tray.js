
const electron = require('electron');
const { checkForUpdate } = require('./updater');

const separator = { type: 'separator' };

const quitButton = { role: 'quit' };

const generateDisplaysList = (managerInstance) => {
  const displays = electron.screen.getAllDisplays();
  const listedDisplays = displays.map((display, index) => ({
    label: `Display ${index + 1} (${display.size.width}x${display.size.height})`,
    type: 'radio',
    click() {
      managerInstance.changeDisplay(display);
    },
    checked: managerInstance.currentlyUsedDisplay.id === display.id,
  }));

  return {
    label: 'Display',
    submenu: listedDisplays,
  };
};

const buildSubMenu = (label, options, callback) => ({
  label,
  submenu: options.map(option => ({
    label: option.label || option.replace(/^\w/, c => c.toUpperCase()),
    click() {
      callback(option.value || option);
    },
  })),
});

const toolbarSizeMenu = managerInstance =>
  buildSubMenu(
    'Toolbar size',
    [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2].map(v => ({
      label: v === 1 ? '100% (normal)' : `${v * 100}%`,
      value: v,
    })),
    managerInstance.changeToolbarSize.bind(managerInstance)
  );

const toolbarPositionMenu = managerInstance =>
  buildSubMenu(
    'Toolbar position',
    ['left', 'right'],
    managerInstance.changeToolbarPosition.bind(managerInstance)
  );

exports.trayMenuLoggedIn = managerInstance => [
  {
    label: 'Check for updates',
    click: () => checkForUpdate(),
  },
  toolbarSizeMenu(managerInstance),
  // toolbarPositionMenu(managerInstance),
  generateDisplaysList(managerInstance),
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
