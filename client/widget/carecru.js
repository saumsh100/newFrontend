
import ee from 'event-emitter';
import Host from 'ifrau/host';
import Modal from './modal';

/**
 * CareCru Widget API
 *
 * @param iframeSrc
 * @constructor
 */
function CareCru({ iframeSrc }) {
  this.modal = new Modal();
  this.host = new Host(() => this.modal.inner, iframeSrc, {
    id: 'CareCruIframe',
    height: '100%',
  });

  const frame = document.querySelector('#CareCruIframe');
  const self = this;

  frame.onload = function () {
    const button = document.querySelector('.CareCruButton');
    button.classList.add('fadeIn');
  };

  this.host.connect().then(() => {
    console.log('Connected to client!');

    const spinner = document.querySelector('.CareCruSpinner');
    spinner.classList.add('fadeOut');

    setTimeout(() => {
      spinner.remove();
    }, 450);
  });

  this.host.onEvent('closeModal', (route) => {
    self.lastRoute = route;
    self.close();
  });

  this.host.onEvent('completeBooking', () => {
    if (window.ga) {
      window.ga('send', 'event', 'CareCru Online Scheduler', 'New Appointment Request', null, null);
    }
    console.log('Completed booking!');
  });
}

// Bind event-emitter like functionality on CareCru API for better
// client control of our functionality
ee(CareCru.prototype);

/**
 * #open
 */
CareCru.prototype.open = function (route = 'book') {
  this.emit('open');
  this.host.sendEvent('changeBaseRoute', route);
  this.modal.open();
  this.emit('opened');
};

CareCru.prototype.mergeReviewValues = function (values) {
  this.host.sendEvent('mergeReviewValues', values);
};

CareCru.prototype.mergeSentReviewValues = function (values) {
  this.host.sendEvent('mergeSentReviewValues', values);
};

CareCru.prototype.setSentRecallId = function (id) {
  this.host.sendEvent('setSentRecallId', id);
};

CareCru.prototype.setDueDate = function (id) {
  this.host.sendEvent('setDueDate', id);
};

/**
 * #close
 */
CareCru.prototype.close = function () {
  this.emit('close');
  this.modal.close();
  this.emit('closed');
};

export default CareCru;
