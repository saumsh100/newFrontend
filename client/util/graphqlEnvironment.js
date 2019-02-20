/* eslint-disable import/no-extraneous-dependencies */



import { Environment, Network, RecordSource, Store } from 'relay-runtime'; // eslint-disable-line import/no-extraneous-dependencies
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getApiUrl, getSubscriptionUrl } from './hub';
import globals from '../../server/config/globals';

const getTokenDefault = () => localStorage.getItem('token');
const path = '/graphql';

const socketProtocol = globals.protocol === 'https' ? 'wss' : 'ws';

function getUrlWithPath() {
  return getApiUrl() + path;
}

export function apolloClient() {
  const token = getTokenDefault();

  const httpLink = new HttpLink({
    uri: getUrlWithPath(),
    headers: { Authorization: `Bearer ${token}` },
  });
  const wsLink = setupSubscription();

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
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

const setupSubscription = () => {
  const token = getTokenDefault();

  return new WebSocketLink({
    uri: `${socketProtocol}://${getSubscriptionUrl()}/subscriptions`,
    reconnect: true,
    connectionParams: { Authorization: token },
  });
};

const environment = new Environment({
  network: Network.create(fetchQuery(), setupSubscription),
  store: new Store(new RecordSource()),
});

export default environment;
