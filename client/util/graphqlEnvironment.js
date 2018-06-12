
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { isOnDevice, getApiUrl } from './hub';

const getTokenDefault = () => localStorage.getItem('token');
const path = '/graphql';

const url = !isOnDevice() ? path : getApiUrl() + path;

const fetchQuery = (getToken = getTokenDefault) => (operation, variables) => {
  const token = getToken();

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json());
};

const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text;

  const subscriptionClient = new SubscriptionClient('ws://localhost:5000/subscriptions', {
    reconnect: true,
  });

  subscriptionClient.request({ query, variables }).subscribe((response) => {
    observer.onNext({
      data: response.data,
    });
  });
};

const environment = new Environment({
  network: Network.create(fetchQuery(), setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;
