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

  const self = this;

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.CareCruButton');
    button.classList.add('CareCruFadeIn');
  });

  this.host.connect().then(() => {
    console.log('Connected to client!');

    const spinner = document.querySelector('.CareCruSpinner');
    spinner.classList.add('CareCruFadeOut');

    setTimeout(() => {
      spinner.remove();
    }, 450);
  });

  this.host.onEvent('closeModal', (route) => {
    self.lastRoute = route;
    self.close();
  });

  this.host.onEvent('completeBooking', () => {
    const eventAction = 'New Appointment Request';
    const analyticsEvent = {
      event_category: 'CareCru Online Scheduler',
      event_label: null,
    };

    /**
     * We check if gtm or google tag, or google analytics is ready,
     * use the most immediately available one
     */

    // Assuming data layer is in place, google tag manager should've been properly loaded.
    if (Array.isArray(window.dataLayer)) {
      // using dataLayer to fire events to google tag manager
      window.dataLayer.push({
        event: 'New Appointment Request',
      });
    } else if (window.gtag) {
      window.gtag('event', eventAction, analyticsEvent);
    } else if (window.ga) {
      window.ga(
        'send',
        'event',
        analyticsEvent.event_category,
        eventAction,
        analyticsEvent.event_label,
        null,
      );
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
CareCru.prototype.open = function(route = 'book') {
  this.emit('open');
  this.host.sendEvent('changeBaseRoute', route);
  this.modal.open();
  this.emit('opened');
};

CareCru.prototype.mergeReviewValues = function(values) {
  this.host.sendEvent('mergeReviewValues', values);
};

CareCru.prototype.mergeSentReviewValues = function(values) {
  this.host.sendEvent('mergeSentReviewValues', values);
};

CareCru.prototype.setSentRecallId = function(id) {
  this.host.sendEvent('setSentRecallId', id);
};

CareCru.prototype.startRecall = function() {
  this.host.sendEvent('startRecall');
};

CareCru.prototype.setDueDate = function(id) {
  this.host.sendEvent('setDueDate', id);
};

/**
 * #close
 */
CareCru.prototype.close = function() {
  this.emit('close');
  this.modal.close();
  this.emit('closed');
};

export default CareCru;
