
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import apolloClient from '../util/graphqlEnvironment';
import storeShape from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import ReviewsRoutes from '../routes/Reviews';

function ReviewsApp({ store, browserHistory }) {
  return (
    <ApolloProvider client={apolloClient()}>
      <Provider store={store}>
        <ReviewsRoutes history={browserHistory} />
      </Provider>
    </ApolloProvider>
  );
}

ReviewsApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default ReviewsApp;
