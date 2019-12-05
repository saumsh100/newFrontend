
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import apolloClient from '../util/graphqlEnvironment';
import storeShape from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import MyRoutes from '../routes/My';
import '../styles/default.scss';

const MyApp = ({ browserHistory, store }) => (
  <ApolloProvider client={apolloClient()}>
    <Provider store={store}>
      <MyRoutes history={browserHistory} />
    </Provider>
  </ApolloProvider>
);

MyApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default MyApp;
