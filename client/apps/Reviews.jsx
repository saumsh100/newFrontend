
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import ReviewsRoutes from '../routes/Reviews';
import ReviewsRoutesV2 from '../routes/ReviewsV2';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import EnabledFeature from '../components/library/EnabledFeature';

function ReviewsApp({ store, browserHistory }) {
  return (
    <Provider store={store}>
      <EnabledFeature
        predicate={({ flags }) => flags.get('booking-widget-v2')}
        render={<ReviewsRoutesV2 history={browserHistory} />}
        fallback={<ReviewsRoutes history={browserHistory} />}
      />
    </Provider>
  );
}

export default ReviewsApp;

ReviewsApp.propTypes = {
  browserHistory: PropTypes.shape(historyShape).isRequired,
  store: PropTypes.shape({
    liftedStore: PropTypes.object,
    dispatch: PropTypes.func,
    getState: PropTypes.func,
    replaceReducer: PropTypes.func,
    subscribe: PropTypes.func,
  }).isRequired,
};
