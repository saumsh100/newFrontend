
import { Environment, Network, RecordSource, Store } from 'relay-runtime'; // eslint-disable-line import/no-extraneous-dependencies
import ApolloClient from 'apollo-boost';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getApiUrl, getSubscriptionUrl } from './hub';

const getTokenDefault = () => localStorage.getItem('token');
const path = '/graphql';

const socketProtocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';

function getUrlWithPath() {
  return getApiUrl() + path;
}

export function apolloClient() {
  return new ApolloClient({
    url: getUrlWithPath(),
    request: async (operation) => {
      const token = getTokenDefault();
      operation.setContext({ headers: { Authorization: `Bearer ${token}` } });
    },
  });
}

const fetchQuery = (getToken = getTokenDefault) => (operation, variables) => {
  const token = getToken();

  return fetch(getUrlWithPath(), {
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

  const subscriptionClient = new SubscriptionClient(
    `${socketProtocol}://${getSubscriptionUrl()}/subscriptions`,
    {
      reconnect: true,
      connectionParams: { Authorization: token },
    },
  );

  const client = subscriptionClient
    .request({
      query,
      variables,
    })
    .subscribe((response) => {
      observer.onNext({ data: response.data });
    });

  return { dispose: client.unsubscribe };
};

const environment = new Environment({
  network: Network.create(fetchQuery(), setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;
