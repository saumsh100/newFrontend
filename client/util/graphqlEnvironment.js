
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http'; // eslint-disable-line import/no-extraneous-dependencies
import { getMainDefinition } from 'apollo-utilities'; // eslint-disable-line import/no-extraneous-dependencies
import { split } from 'apollo-link'; // eslint-disable-line import/no-extraneous-dependencies
import { InMemoryCache } from 'apollo-cache-inmemory'; // eslint-disable-line import/no-extraneous-dependencies
import { WebSocketLink } from 'apollo-link-ws';
import { getSubscriptionUrl } from './hub';

const getTokenDefault = () => localStorage.getItem('token');
const defaultEndpoint = '/graphql';
const nestEndpoint = '/newgraphql';
const isNestOperation = operation => operation.search(/\w*_NEST\b/) === -1;
const getUrlWithPath = (path = defaultEndpoint) => path;

export default () => {
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

const setupSubscription = () =>
  new WebSocketLink({
    uri: getSubscriptionUrl('/subscriptions'),
    reconnect: true,
    connectionParams: { Authorization: getTokenDefault() },
  });
