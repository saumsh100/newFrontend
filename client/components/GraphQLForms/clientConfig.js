import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
  uri: process.env.FORMS_WS_API || '',
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: process.env.FORMS_API || '',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

// eslint-disable-next-line import/prefer-default-export
export const formsClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
