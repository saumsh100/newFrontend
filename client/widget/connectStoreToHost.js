
import Client from 'ifrau/client';
import { push } from 'connected-react-router';
import { mergeReviewValues, mergeSentReviewValues } from '../reducers/reviewsWidget';
import { setSentRecallId, setDueDate } from '../actions/availabilities';
import { setSelectedServiceId } from '../reducers/availabilities';
import { startRecall } from '../thunks/availabilities';

const allowedRoutes = {
  book: true,
  review: true,
};

export default function connectStoreToHost(store) {
  const { reviews } = store.getState();
  const account = reviews.get('account');

  // Did this because it was the easiest way to ensure baseRouting
  const base = (path = '') => `/widgets/${account.id}/app${path}`;

  // Create new ifrau Client to connect to a host app (clinic website)
  const client = new Client({ syncLang: false });
  client.connect().then(() => {
    console.log('connected to host!');
  });

  // For testing...
  /* window.changeBaseRoute = (route) => {
    if (!allowedRoutes[route]) {
      return;
    }

    // Route SPA to that route and view
    console.log('dispatching changeBaseRoute!');
    store.dispatch(push(base(`/${route}`)));
  }; */

  client.onEvent('changeBaseRoute', (route) => {
    if (!allowedRoutes[route]) {
      return;
    }

    // Route SPA to that route and view
    store.dispatch(push(base(`/${route}`)));
  });

  client.onEvent('mergeReviewValues', (values) => {
    // used to route
    store.dispatch(mergeReviewValues(values));
  });

  client.onEvent('mergeSentReviewValues', (values) => {
    // used to route
    store.dispatch(mergeSentReviewValues(values));
  });

  client.onEvent('setSelectedServiceId', (values) => {
    // used to route
    store.dispatch(setSelectedServiceId(values));
  });

  client.onEvent('setSentRecallId', (sentRecallId) => {
    // used to route
    store.dispatch(setSentRecallId(sentRecallId));
  });

  client.onEvent('startRecall', () => {
    // used to route
    store.dispatch(startRecall());
  });

  client.onEvent('setDueDate', (dueDate) => {
    // used to route
    store.dispatch(setDueDate(dueDate));
  });

  window.iframeClient = client;
}
