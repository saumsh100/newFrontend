
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

  this.host.connect().then(() => {
    console.log('Connected to client!');
  });

  this.host.onEvent('closeModal', () => {
    this.modal.close();
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

CareCru.prototype.setStars = function (stars) {
  this.host.sendEvent('setStars', parseInt(stars));
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
