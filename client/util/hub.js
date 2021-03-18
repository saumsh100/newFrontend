import apiHost from './getApiHost';

const { location } = window;

let PRODUCTION_API = `${location.protocol.replace(':', '')}://${location.host}`;

export const TOOLBAR_LEFT = 'left';
export const TOOLBAR_RIGHT = 'right';

export function isHub() {
  return window && window.process && window.process.type;
}

export function isOnDevice() {
  return isHub();
}

export function setApiUrl(url) {
  PRODUCTION_API = url;
}

export function getApiUrl() {
  return PRODUCTION_API;
}

export function getSubscriptionUrl(path = '') {
  const [protocol, host] = isHub() ? PRODUCTION_API.split('://') : apiHost.split('://');

  const isLocal = location.hostname !== host
    && (location.host === 'localhost' || location.host.includes('127.0.0.1'));
  return `${protocol === 'https' || isLocal ? 'wss:' : 'ws:'}//${host}${path}`;
}

export function getSocketUrl() {
  if (!isOnDevice()) {
    return apiHost;
  }

  return PRODUCTION_API;
}

export function isResponsive() {
  return isHub() || window.innerWidth <= 576;
}
