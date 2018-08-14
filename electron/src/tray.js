
const electron = require('electron');
const { checkForUpdate } = require('./updater');

const separator = { type: 'separator' };
const quitButton = { role: 'quit' };

/**
 * Generate the menu object for displays
 * @param {*} managerInstance
 */
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

/**
 * Generic tray menu builder
 * @param {*} label menu label
 * @param {*} options options can be string array or label/value object array.
 * @param {*} callback callback called on click method
 */
const buildSubMenu = (label, options, callback) => ({
  label,
  submenu: options.map(option => ({
    // use the label property or capitalize the option
    label: option.label || option.replace(/^\w/, c => c.toUpperCase()),
    click() {
      callback(option.value || option);
    },
    type: option.type,
    checked: option.checked,
  })),
});

/**
 * Generate the menu object for toolbar size
 * @param {*} managerInstance
 */
const toolbarSizeMenu = managerInstance =>
  buildSubMenu(
    'Toolbar size',
    // initial set of options of zoom factors
    [0.6, 0.8, 1, 1.2, 1.4].map(v => ({
      label: v === 1 ? '100% (normal)' : `${v * 100}%`,
      value: v,
      type: 'radio',
      checked: v === parseFloat(managerInstance.zoomFactor),
    })),
    managerInstance.setWindowScale.bind(managerInstance),
  );

/**
 * Generate the menu object for toolbar position
 * @param {*} managerInstance
 */
const toolbarPositionMenu = managerInstance =>
  buildSubMenu(
    'Toolbar position',
    ['left', 'right'],
    managerInstance.changeToolbarPosition.bind(managerInstance),
  );

exports.trayMenuLoggedIn = managerInstance => [
  {
    label: 'Check for updates',
    click: () => checkForUpdate(),
  },
  toolbarSizeMenu(managerInstance),
  toolbarPositionMenu(managerInstance),
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
