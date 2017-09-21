/**
 * This script is injected into 3rd party websites to produce the Book Online button
 */

(function() {

  window.CareCru = window.CareCru || {
    // Insert default settings here
    showBookingButton: true,
  };

  window.CareCru.bookingWidgets = window.CareCru.bookingWidgets || {};
  window.CareCru.BookingWidget = window.CareCru.BookingWidget || {};

  // The purpose of doing this is to ensure this script can run without replacement
  const __REPLACE_THIS_COLOR__ = null;
  const __REPLACE_THIS_STYLE_TEXT__ = null;
  const __REPLACE_THIS_IFRAME_SRC__ = null;
  const __ACCOUNT_ID__ = null;
  const BOOKING_WIDGET_PRIMARY_COLOR = __REPLACE_THIS_COLOR__;
  const STYLE_TEXT = __REPLACE_THIS_STYLE_TEXT__;
  const IFRAME_SRC = __REPLACE_THIS_IFRAME_SRC__;
  const ACCOUNT_ID = __ACCOUNT_ID__;

  function CareCruBookingModal({ modalBody }) {
    const overlay = document.createElement('div');
    overlay.className = 'CareCruModal';

    // We actually don't wanna do this, only let users close with the x in top right
    /*overlay.onclick = (e) => {
     e.preventDefault();
     e.stopPropagation();
     self.close();
     };*/

    const inner = document.createElement('div');
    inner.className = 'CareCruModalInner';

    const body = document.getElementsByTagName('body')[0];

    inner.appendChild(modalBody);
    overlay.appendChild(inner);
    body.appendChild(overlay);

    this.overlay = overlay;
    this.inner = inner;
  }

  CareCruBookingModal.prototype.open = function() {
    this.overlay.className = `${this.overlay.className} CareCruActive`;
    this.inner.className = `${this.inner.className} CareCruActive`;
    document.documentElement.style.setProperty('overflow', 'hidden');
    document.documentElement.style.setProperty('position', 'fixed');
  };

  CareCruBookingModal.prototype.close = function() {
    this.overlay.className = this.overlay.className.replace('CareCruActive', '');
    this.inner.className = this.inner.className.replace('CareCruActive', '');
    document.documentElement.style.setProperty('overflow', '');
    document.documentElement.style.setProperty('position', '');
  };

  window.document.addEventListener('DOMContentLoaded', function() {
    // Create the Book Online Button
    const bookingButton = document.createElement('div');
    bookingButton.innerHTML = 'Book Online';
    bookingButton.className = 'CareCruButton';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', 'yes');
    iframe.className = 'CareCruIframe';
    iframe.src = IFRAME_SRC;

    // modal.style.transition = 'translateX(-50%)';
    // modal.style.marginTop = '50px';
    // document.querySelector('style').textContent += '@media screen and (max-height : 610px) { #modal { height: 90% !important }}';

    // Set the global pirmary color to be used in the button CSS;
    document.body.style.setProperty('--bookingWidgetPrimaryColor', BOOKING_WIDGET_PRIMARY_COLOR);

    const style = document.createElement('style');
    style.textContent += STYLE_TEXT;

    const body = document.getElementsByTagName('body')[0];
    const head = document.getElementsByTagName('head')[0];

    // Insert at top of head so that any consecutive style can override
    head.insertBefore(style, head.firstChild);

    // Show booking button by appending into end of body
    window.CareCru.showBookingButton && body.appendChild(bookingButton);

    const ccmodal = new CareCruBookingModal({ modalBody: iframe });

    bookingButton.onclick = function () {
      ccmodal.open();
    };

    window.addEventListener('message', () => ccmodal.close());

    if (window.location.search.indexOf('ccbw') > -1) {
      ccmodal.open();
    }

    console.log('ACCOUNT_ID', ACCOUNT_ID);
    window.CareCru.bookingWidgets[ACCOUNT_ID] = ccmodal;
    console.log('added account', ACCOUNT_ID);

    if (Object.keys(window.CareCru.bookingWidgets).length > 1) {
      // A widget has already been created, open must now accept a target
      window.CareCru.BookingWidget.open = function(accountId) {
        if (!accountId) {
          throw new Error('Missing parameter accountId, you have multiple widgets installed on this page.');
        }

        window.CareCru.bookingWidgets[accountId].open();
      };

      // A widget has already been created, open must now accept a target
      window.CareCru.BookingWidget.close = function(accountId) {
        if (!accountId) {
          throw new Error('Missing parameter accountId, you have multiple widgets installed on this page.');
        }

        window.CareCru.bookingWidgets[accountId].close();
      };
    } else {
      // A widget has already been created, open must now accept a target
      window.CareCru.BookingWidget.open = function() {
        ccmodal.open();
      };

      // A widget has already been created, open must now accept a target
      window.CareCru.BookingWidget.close = function() {
        ccmodal.close();
      };
    }

    console.log('Done Widget Loading 123123');
  });

})();
