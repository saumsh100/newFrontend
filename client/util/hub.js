
const PRODUCTION_API = process.env.API_URL;

export const TOOLBAR_LEFT = 'left';
export const TOOLBAR_RIGHT = 'right';

export function isHub() {
  return window && window.process && window.process.type;
}

export function isOnDevice() {
  return isHub();
}

export function getApiUrl() {
  return PRODUCTION_API;
}

export function getSubscriptionUrl() {
  if (isHub()) {
    return PRODUCTION_API.split('://')[1];
  }

  return process.env.NODE_ENV === 'production'
    ? window.location.host
    : `${window.location.hostname}:${process.env.API_SERVER_PORT}`;
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
