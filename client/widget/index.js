
import CareCruAPI from './carecru';
import UI from './ui';

const __CARECRU_ACCOUNT_ID__ = null;
const __CARECRU_WIDGET_PRIMARY_COLOR__ = null;
const __CARECRU_STYLE_CSS__ = null;
const __CARECRU_IFRAME_SRC__ = null;

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

function isValidStarsVariable(stars) {
  const num = parseInt(stars);
  return 1 <= num && num >= 5;
}

/**
 * This is the script that builds Modal UI, and initiates client-side
 * CareCru object to control embedded widgets
 *
 * Order:
 *  - inject styles into head
 *  - create button if showBookingButton is true
 *  - create Modal w/ iframe
 *  - bind button onclick handler
 *  - bind window event listener to close modal
 *  - parse query string to trigger correct actions
 */
function main() {
  // Registering settings and defaults
  window.CareCruSettings = Object.assign({}, {
    showBookingButton: true,
  }, window.CareCruSettings);

  window.CareCruz = window.CareCruz || {};

  UI.injectStyleText(__CARECRU_STYLE_CSS__);

  // Parse URL for stars
  const stars = getQueryVariable('stars');
  let iframeSrc = __CARECRU_IFRAME_SRC__;
  if (stars && isValidStarsVariable(stars)) {
    iframeSrc += `?stars=${stars}`;
  }

  // Create API for that clinic's widget
  window.CareCru = new CareCruAPI({ iframeSrc });

  // Add to clinic registry so pages with multiple widgets can programmitcally manage
  window.CareCruz[__CARECRU_ACCOUNT_ID__] = window.CareCru;

  // Set global color
  document.documentElement.style.setProperty('--bookingWidgetPrimaryColor', __CARECRU_WIDGET_PRIMARY_COLOR__);

  // This should always be off for multiple widgets
  // but I would rather change SPA to allow toggling of accountId first
  if (window.CareCruSettings.showBookingButton) {
    const button = UI.bookingButton();
    button.onclick = (e) => {
      e.preventDefault();
      CareCru.open('book');
    };
  }

  // Parse URL to see if we are being linked here
  const cc = getQueryVariable('cc');
  const sentReviewId = getQueryVariable('srid');
  const accountId = getQueryVariable('accountId');
  if (cc) {
    // open the appropriate modal with that route open
    if (window.CareCruz[accountId]) {
      window.CareCruz[accountId].open(cc);
    } else {
      window.CareCru.open(cc);
    }
  }

  if (stars && sentReviewId) {
    const data = { stars, sentReviewId };
    if (window.CareCruz[accountId]) {
      window.CareCruz[accountId].mergeReviewValues(data);
    } else {
      window.CareCru.mergeReviewValues(data);
    }
  }
}

main();
