import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../util/graphqlEnvironment';
import storeShape from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import DashboardRoutes from '../routes/Dashboard';
import { isFeatureEnabledSelector } from '../reducers/featureFlags';
import appendFonts from './appendFonts';
import '../styles/default.scss';
import '../../public/scripts/zendesk';

const DashboardApp = ({ browserHistory, store }) => {
  const canUseNewFonts = isFeatureEnabledSelector(
    store.featureFlags?.get('flags'),
    'show-new-font',
  );
  if (canUseNewFonts) {
    appendFonts();
  }
  return (
    <ApolloProvider client={apolloClient()}>
      <Provider store={store}>
        <DashboardRoutes history={browserHistory} />
      </Provider>
    </ApolloProvider>
  );
};

DashboardApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default DashboardApp;
