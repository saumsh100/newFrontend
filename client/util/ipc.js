
import { isHub } from './hub';

if (isHub()) {
  const { ipcRenderer, webFrame } = window.require('electron');

  module.exports.webFrame = webFrame;

  module.exports.electron = {
    on: (channel, handler) => {
      ipcRenderer.on(channel, handler);
    },

    once: (channel, handler) => {
      ipcRenderer.once(channel, handler);
    },

    send: (channel, message) => {
      ipcRenderer.send(channel, message);
    },
  };
}
