
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { isOnDevice, getApiUrl, getSubscriptionUrl } from './hub';

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
  const token = getTokenDefault();

  const subscriptionClient = new SubscriptionClient(`ws://${getSubscriptionUrl()}/subscriptions`, {
    reconnect: true,
    connectionParams: {
      Authorization: token,
    },
  });

  const client = subscriptionClient.request({ query, variables }).subscribe((response) => {
    observer.onNext({
      data: response.data,
    });
  });

  return {
    dispose: client.unsubscribe,
  };
};

const environment = new Environment({
  network: Network.create(fetchQuery(), setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;
