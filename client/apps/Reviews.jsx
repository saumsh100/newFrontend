
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { apolloClient } from '../util/graphqlEnvironment';
import { storeShape } from '../components/library/PropTypeShapes/reduxShapes';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import ReviewsRoutes from '../routes/Reviews';
import ReviewsRoutesV2 from '../routes/ReviewsV2';
import EnabledFeature from '../components/library/EnabledFeature';

function ReviewsApp({ store, browserHistory }) {
  return (
    <ApolloProvider client={apolloClient()}>
      <Provider store={store}>
        <EnabledFeature
          predicate={({ flags }) => flags.get('booking-widget-v2')}
          render={<ReviewsRoutesV2 history={browserHistory} />}
          fallback={<ReviewsRoutes history={browserHistory} />}
        />
      </Provider>
    </ApolloProvider>
  );
}

ReviewsApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape(storeShape).isRequired,
};

export default ReviewsApp;
