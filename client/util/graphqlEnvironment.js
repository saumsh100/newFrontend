import { ApolloClient, HttpLink, split, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // eslint-disable-line import/no-extraneous-dependencies
import { getMainDefinition } from '@apollo/client/utilities'; // eslint-disable-line import/no-extraneous-dependencies
import { WebSocketLink } from '@apollo/client/link/ws';
import { getSubscriptionUrl } from './hub';
import apiHost from './getApiHost';

const getTokenDefault = () => localStorage.getItem('token');
const defaultEndpoint = '/graphql';
const nestEndpoint = '/newgraphql';
const isNestOperation = (operation) => operation.search(/(_NEST+)+$/) === -1;
const getUrlWithPath = (path = defaultEndpoint) => `${apiHost}${path}`;

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
