/**
 * This script is injected into 3rd party websites to produce the Book Online button
 */

(function() {

  // The purpose of doing this is to ensure this script can run without replacement
  const __REPLACE_THIS_COLOR__ = null;
  const __REPLACE_THIS_STYLE_TEXT__ = null;
  const __REPLACE_THIS_IFRAME_SRC__ = null;
  const BOOKING_WIDGET_PRIMARY_COLOR = __REPLACE_THIS_COLOR__;
  const STYLE_TEXT = __REPLACE_THIS_STYLE_TEXT__;
  const IFRAME_SRC = __REPLACE_THIS_IFRAME_SRC__;

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
    this.overlay.className = `${this.overlay.className} active`;
    this.inner.className = `${this.inner.className} active`;
  };

  CareCruBookingModal.prototype.close = function() {
    this.overlay.className = this.overlay.className.replace('active', '');
    this.inner.className = this.inner.className.replace('active', '');
  };

  window.document.addEventListener('DOMContentLoaded', function() {
    // Create the Book Online Button
    const bookingButton = document.createElement('div');
    bookingButton.innerHTML = 'Book Online';
    bookingButton.className = 'CareCruButton';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'modal');
    //iframe.setAttribute('scrolling', 'yes');
    iframe.className = 'CareCruIframe';
    console.log(IFRAME_SRC);
    iframe.src = IFRAME_SRC;

    // modal.style.transition = 'translateX(-50%)';
    // modal.style.marginTop = '50px';
    // document.querySelector('style').textContent += '@media screen and (max-height : 610px) { #modal { height: 90% !important }}';

    // Set the global pirmary color to be used in the button CSS;
    document.body.style.setProperty('--bookingWidgetPrimaryColor', BOOKING_WIDGET_PRIMARY_COLOR);

    const style = document.createElement('style');
    style.textContent += STYLE_TEXT;

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(style);
    body.appendChild(bookingButton);

    const ccmodal = new CareCruBookingModal({ modalBody: iframe });

    bookingButton.onclick = function () {
      ccmodal.open();
    };

    window.addEventListener('message', () => ccmodal.close());
  });

})();
