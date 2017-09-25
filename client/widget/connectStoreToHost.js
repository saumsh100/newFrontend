
import Client from  'ifrau/client';
import { push } from 'react-router-redux';
import { mergeReviewValues } from '../reducers/reviewsWidget';

const allowedRoutes = {
  book: true,
  review: true,
};

export default function connectStoreToHost(store) {
  const client = new Client();
  client.connect().then(function() {
    console.log('connected to host!');
  });

  client.onEvent('changeBaseRoute', (route) => {
    if (!allowedRoutes[route]) {
      return;
    }

    // Route SPA to that route and view
    store.dispatch(push(`./${route}`));
  });

  client.onEvent('mergeReviewValues', (values) => {
    // used to route
    store.dispatch(mergeReviewValues(values));
  });

  window.iframeClient = client;
}
