import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http'; // eslint-disable-line import/no-extraneous-dependencies
import { setContext } from 'apollo-link-context'; // eslint-disable-line import/no-extraneous-dependencies
import { getMainDefinition } from 'apollo-utilities'; // eslint-disable-line import/no-extraneous-dependencies
import { split } from 'apollo-link'; // eslint-disable-line import/no-extraneous-dependencies
import { InMemoryCache } from 'apollo-cache-inmemory'; // eslint-disable-line import/no-extraneous-dependencies
import { WebSocketLink } from 'apollo-link-ws';
import { getSubscriptionUrl } from './hub';
import getApiHost from './getApiHost';

const getTokenDefault = () => localStorage.getItem('token');
const defaultEndpoint = '/graphql';
const nestEndpoint = '/newgraphql';
const isNestOperation = operation => operation.search(/\w*_NEST\b/) === -1;
const getUrlWithPath = (path = defaultEndpoint) => `${getApiHost()}${path}`;

export default () => {
  const httpLink = new HttpLink({
    // The logic below is required, so that we can support both NEST and legacy api endpoints.
    uri: ({ operationName }) =>
      getUrlWithPath(isNestOperation(operationName) ? defaultEndpoint : nestEndpoint),
  });

  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  const authLink = setContext((_, { headers }) => {
    const token = getTokenDefault();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    setupSubscription(),
    authLink.concat(httpLink),
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
