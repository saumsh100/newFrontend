
import { ipcRenderer, webFrame } from 'electron';

export { webFrame };

export const electron = {
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
