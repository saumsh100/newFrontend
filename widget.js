/**
 * This script is injected into 3rd party websites to produce the Book Online button
 */

(function () {
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

  window.document.addEventListener('DOMContentLoaded', function () {
    // Create the Book Online Button
    const bookingButton = document.createElement('div');
    bookingButton.innerHTML = 'Book Online';
    bookingButton.className = 'CareCruButton';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'modal');
    //iframe.setAttribute('scrolling', 'yes');
    iframe.className = 'CareCruIframe';
    iframe.src = 'http://my.carecru.dev:5000/embeds/1aeab035-b72c-4f7a-ad73-09465cbf5654';
    // iframe.src = '{{host}}/embeds/{{account.id}}';

    // modal.style.transition = 'translateX(-50%)';
    // modal.style.marginTop = '50px';
    // document.querySelector('style').textContent += '@media screen and (max-height : 610px) { #modal { height: 90% !important }}';


    document.getElementsByTagName('body')[0].appendChild(bookingButton);

    const ccmodal = new CareCruBookingModal({ modalBody: iframe });

    bookingButton.onclick = function () {
      ccmodal.open();
    };

    window.addEventListener('message', () => ccmodal.close());
  });

})();
