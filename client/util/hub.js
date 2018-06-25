
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
  return PRODUCTION_API.split('://')[1];
}

export function getSocketUrl() {
  if (!isOnDevice()) {
    return '';
  }

  return PRODUCTION_API;
}

export function isResponsive() {
  return isHub() || window.screen.width <= 576;
}
