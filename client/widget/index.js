/* eslint-disable */
import CareCruAPI from './carecru';
import UI from './ui';
import { darkerColor, hexToRgbA } from '../components/library/util/colorMap';

/* IMPORTANT: DO NOT TOUCH THESE, VERY SENSITIVE SEARCH AND REPLACE */
/* DO NOT USE THESE STRINGS ANYWHERE ELSE OR ELSE SEARCH AND REPLACE WILL NOT WORK */
const __CARECRU_ACCOUNT_ID__ = '__CARECRU_ACCOUNT_ID__';
const __CARECRU_WIDGET_PRIMARY_COLOR__ = '__CARECRU_WIDGET_PRIMARY_COLOR__';
const __CARECRU_WIDGET_BUTTON_LABEL__ = '__CARECRU_WIDGET_BUTTON_LABEL__';
const __CARECRU_STYLE_CSS__ = '__CARECRU_STYLE_CSS__';
const __CARECRU_IFRAME_SRC__ = '__CARECRU_IFRAME_SRC__';
const __CARECRU_EXTERNAL_ID__ = '__CARECRU_EXTERNAL_ID__';
const __CARECRU_ACC_ID__ = '__CARECRU_ACC_ID__';
const __CARECRU_PRACTICE_NAME__ = '__CARECRU_PRACTICE_NAME__';

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

function prepareIFrameSrc(ccUrl, utmParams, referrerURL = '') {
  const utmString = Object.entries(utmParams)
    .reduce((result, [key, val]) => {
      if (val && !(ccUrl || '').includes(`${key}=`)) {
        result.push(`${key}=${val}`);
      }
      return result;
    }, [])
    .join('&');

  const widgetURL = ccUrl ? `${__CARECRU_IFRAME_SRC__}/${ccUrl}` : `${__CARECRU_IFRAME_SRC__}/book`;

  const iFrameSrc = utmString ? addURLParams(widgetURL, utmString) : widgetURL;

  return addURLParams(iFrameSrc, `ref=${referrerURL}`);
}

function addURLParams(url, params) {
  return url.indexOf('?') === -1 ? `${url}?${params}` : `${url}&${params}`;
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
  window.CareCruSettings = Object.assign(
    {},
    {
      showBookingButton: true,
    },
    window.CareCruSettings,
  );

  window.CareCruz = window.CareCruz || {};

  UI.injectStyleText(__CARECRU_STYLE_CSS__);

  // Parse URL to see if we are being linked here
  const sentReviewId = getQueryVariable('srid');
  const sentRecallId = getQueryVariable('sentRecallId');
  const dueDate = getQueryVariable('dueDate');
  const accountId = getQueryVariable('accountId');
  const stars = getQueryVariable('stars') || 0;
  const cc = getQueryVariable('cc');
  const suffix = cc && 'review' === cc ? cc : 'book';
  const utmParams = {
    utm_source: getQueryVariable('utm_source') || '',
    utm_campaign: getQueryVariable('utm_campaign') || '',
    utm_medium: getQueryVariable('utm_medium') || '',
  };

  const ccUrl = cc && (sentRecallId ? 'book/date-and-time' : suffix) + window.location.search;

  const iframeSrc = prepareIFrameSrc(ccUrl, utmParams, document.referrer);

  console.log('iframeSrc', __CARECRU_IFRAME_SRC__, iframeSrc);

  const externalID = __CARECRU_EXTERNAL_ID__;
  const accID = __CARECRU_ACC_ID__;
  const practiceName = __CARECRU_PRACTICE_NAME__;

  // Create API for that clinic's widget
  window.CareCru = new CareCruAPI({ iframeSrc, externalID, practiceName, accID });

  // Add to clinic registry so pages with multiple widgets can programmitcally manage
  window.CareCruz[__CARECRU_ACCOUNT_ID__] = window.CareCru;

  // Set global color
  document.documentElement.style.setProperty(
    '--bookingWidgetPrimaryColor',
    __CARECRU_WIDGET_PRIMARY_COLOR__,
  );
  document.documentElement.style.setProperty(
    '--bookingWidgetPrimaryColorDarker',
    `rgb(${darkerColor(
      hexToRgbA(__CARECRU_WIDGET_PRIMARY_COLOR__, 1).slice(5, -4).split(','),
      -10,
    )})`,
  );

  // This should always be off for multiple widgets
  // but I would rather change SPA to allow toggling of accountId first
  if (window.CareCruSettings.showBookingButton) {
    const button = UI.bookingButton(__CARECRU_WIDGET_BUTTON_LABEL__);
    button.onclick = (e) => {
      e.preventDefault();
      window.CareCru.open(CareCru.lastRoute);
    };
  }
  const client = window.CareCruz[accountId] || window.CareCru;
  if (ccUrl) {
    // open the appropriate modal with that route open
    if (sentReviewId) {
      client.mergeReviewValues({ stars });
      client.mergeSentReviewValues({ id: sentReviewId });
    }
    if (sentRecallId) {
      client.setSentRecallId(sentRecallId);
      client.setDueDate(dueDate);
      client.startRecall();
    }

    client.open(ccUrl);
  }
}

main();
