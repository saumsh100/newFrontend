import ee from 'event-emitter';
import Host from 'ifrau/host';
import Modal from './modal';

/**
 * CareCru Widget API
 *
 * @param iframeSrc
 * @constructor
 */
function CareCru({ iframeSrc, externalID, practiceName, accID }) {
  this.modal = new Modal();
  this.host = new Host(() => this.modal.inner, iframeSrc, {
    id: 'CareCruIframe',
    height: '100%',
  });

  const self = this;

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
    let dataLayerLabel;
    if (externalID !== 'null' && externalID !== 'undefined' && externalID) {
      dataLayerLabel = externalID;
    } else if (practiceName) {
      dataLayerLabel = practiceName;
    } else {
      dataLayerLabel = accID;
    }

    const eventAction = 'New Appointment Request';
    const analyticsEvent = {
      // eslint-disable-next-line camelcase
      event_category: 'CareCru Online Scheduler',
      // eslint-disable-next-line camelcase
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
        category: 'CareCru Online Scheduler',
        label: dataLayerLabel,
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

CareCru.prototype.startRecall = function () {
  this.host.sendEvent('startRecall');
};

CareCru.prototype.setDueDate = function (id) {
  this.host.sendEvent('setDueDate', id);
};

/**
 * #close
 */
CareCru.prototype.close = function () {
  if (window.location.search.search('cc=review') !== -1) {
    window.location.href = window.location.href.split('?')[0].toString();
  }
  this.emit('close');
  this.modal.close();
  this.emit('closed');
};

export default CareCru;
