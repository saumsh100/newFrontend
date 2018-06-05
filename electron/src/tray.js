
const electron = require('electron');
const { checkForUpdate } = require('./updater');

const separator = { type: 'separator' };

const quitButton = { role: 'quit' };

exports.trayMenuLoggedIn = (managerInstance) => {
  return [
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
    generateDisplaysList(managerInstance),
    separator,
    {
      label: 'Logout',
      click: () => managerInstance.logoutUser(),
    },
    quitButton,
  ];
};

exports.trayMenuLoggedOut = () => [
  {
    label: 'Check for updates',
    click: () => checkForUpdate(),
  },
  separator,
  quitButton,
];


const generateDisplaysList = (managerInstance) => {
  const displays = electron.screen.getAllDisplays();
  const listedDisplays = displays.map((display, index) => {
    return {
      label: `Display ${index + 1} (${display.size.width}x${display.size.height})`,
      type: 'radio',
      click() {
        managerInstance.changeDisplay(display);
      },
      checked: managerInstance.currentlyUsedDisplay.id === display.id,
    };
  });

  return {
    label: 'Display',
    submenu: listedDisplays,
  };
};
