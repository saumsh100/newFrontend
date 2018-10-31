
import { host, protocol } from '../../server/config/globals';

let PRODUCTION_API = `${protocol}://${host}`;

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

export function getSubscriptionUrl() {
  if (isHub()) {
    return PRODUCTION_API.split('://')[1];
  }

  return host;
}

export function getSocketUrl() {
  if (!isOnDevice()) {
    return '';
  }

  return PRODUCTION_API;
}

export function isResponsive() {
  return isHub() || window.innerWidth <= 576;
}
