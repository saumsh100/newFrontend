
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import apolloClient from '../util/graphqlEnvironment';
import storeShape from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import DashboardRoutes from '../routes/Dashboard';
import '../styles/default.scss';

const DashboardApp = ({ browserHistory, store }) => (
  <ApolloProvider client={apolloClient()}>
    <Provider store={store}>
      <DashboardRoutes history={browserHistory} />
    </Provider>
  </ApolloProvider>
);

DashboardApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default DashboardApp;
