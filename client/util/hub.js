
const { location } = window;

let PRODUCTION_API = `${location.protocol}://${location.host}`;

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
  const [protocol, host] = isHub()
    ? PRODUCTION_API.split('://')
    : [location.protocol, location.host];

  return `${protocol === 'https:' ? 'wss:' : 'ws:'}//${host}${path}`;
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
