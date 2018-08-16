
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { apolloClient } from '../util/graphqlEnvironment';
import { storeShape } from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import ConnectRoutes from '../routes/Connect';
import '../styles/default.scss';

const ConnectApp = ({ browserHistory, store }) => (
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <ConnectRoutes history={browserHistory} />
    </Provider>
  </ApolloProvider>
);

ConnectApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default ConnectApp;
