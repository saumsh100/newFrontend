
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import apolloClient from '../util/graphqlEnvironment';
import storeShape from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import HubRoutes from '../routes/Hub';
import '../styles/default.scss';

const HubApp = ({ browserHistory, store }) => (
  <ApolloProvider client={apolloClient()}>
    <Provider store={store}>
      <HubRoutes history={browserHistory} />
    </Provider>
  </ApolloProvider>
);

HubApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default HubApp;
