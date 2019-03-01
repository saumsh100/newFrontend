
import { Environment, Network, RecordSource, Store } from 'relay-runtime'; // eslint-disable-line import/no-extraneous-dependencies
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http'; // eslint-disable-line import/no-extraneous-dependencies
import { getMainDefinition } from 'apollo-utilities'; // eslint-disable-line import/no-extraneous-dependencies
import { split } from 'apollo-link'; // eslint-disable-line import/no-extraneous-dependencies
import { InMemoryCache } from 'apollo-cache-inmemory'; // eslint-disable-line import/no-extraneous-dependencies
import { WebSocketLink } from 'apollo-link-ws';
import { getApiUrl, getSubscriptionUrl } from './hub';
import { protocol } from '../../server/config/globals';

const getTokenDefault = () => localStorage.getItem('token');
const socketProtocol = protocol === 'https' ? 'wss' : 'ws';
const defaultEndpoint = '/graphql';
const nestEndpoint = '/newgraphql';
const isNestOperation = operation => operation.search(/\w*_NEST\b/) === -1;
const getUrlWithPath = (path = defaultEndpoint) => getApiUrl() + path;

export const apolloClient = () => {
  const httpLink = new HttpLink({
    // The logic below is required, so that we can support both NEST and legacy api endpoints.
    uri: ({ operationName }) =>
      getUrlWithPath(isNestOperation(operationName) ? defaultEndpoint : nestEndpoint),
    headers: { Authorization: `Bearer ${getTokenDefault()}` },
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    setupSubscription(),
    httpLink,
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

const fetchQuery = () => (operation, variables) =>
  fetch(getUrlWithPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenDefault()}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json());

const setupSubscription = () =>
  new WebSocketLink({
    uri: `${socketProtocol}://${getSubscriptionUrl()}/subscriptions`,
    reconnect: true,
    connectionParams: { Authorization: getTokenDefault() },
  });

export default new Environment({
  network: Network.create(fetchQuery(), setupSubscription),
  store: new Store(new RecordSource()),
});
