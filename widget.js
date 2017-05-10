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

  window.document.addEventListener('DOMContentLoaded', function() {
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

    const style = document.createElement('style');
    style.textContent += `
/*

  Modal

 */

.CareCruModal {
  display: block;
  position: fixed;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.2s, z-index 0s 0.2s;
  text-align: center;
  overflow: hidden;
  overflow-y: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.CareCruModal.active {
  z-index: 99;
  opacity: 1;
  transition: opacity 0.2s;
}

.CareCruModal:before {
  display: inline-block;
  overflow: hidden;
  width: 0;
  height: 100%;
  vertical-align: middle;
  content: "";
}

.CareCruModal > * {
  display: inline-block;
  white-space: normal;
  vertical-align: middle;
  text-align: left;
}

.CareCruModalInner {
  position: relative;
  overflow: hidden;
  width: 800px;
  height: 600px;
  border-radius: 5px;
  max-width: 95%;
  max-height: 95%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  z-index: -1;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s, transform 0.2s, z-index 0s 0.2s;
}

.CareCruModalInner.active {
  z-index: 100;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s, transform 0.2s;
}

/*

  Book Online Button

 */

.CareCruButton {
  position: fixed;
  top: 250px;
  right: 0px;
  width: 150px;
  height: 130px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  cursor: pointer;
  font-size: 1.4em;
  display: flex;
  align-items: center;
  background-color: blue;
  text-align: center;
  justify-content: center;
  text-transform: uppercase;
  padding: 20px;
  color: white;
}

.CareCruButton:hover {
  opacity: 0.9;
}

@media screen and (max-width : 610px) {
  .CareCruButton {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 50px;
    font-size: 1em;
    border-radius: 0;
    justify-content: center;
  }
}

/*

  Booking App Iframe

 */

.CareCruIframe {
  z-index: 101;

  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
} 
    `;

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
