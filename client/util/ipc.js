
// Workaround to force webpack to ignore it.



import { isHub } from './hub';

if (isHub()) {
  const { ipcRenderer } = window.require('electron');

  module.exports.electron = {
    on: (channel, handler) => {
      ipcRenderer.on(channel, handler);
    },

    send: (channel, message) => {
      ipcRenderer.send(channel, message);
    },
  };
}
