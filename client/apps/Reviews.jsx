
import { Provider } from 'react-redux';
import React from 'react';
import ReviewsRoutes from '../routes/Reviews';
import '../styles/default.scss';

const ReviewsApp = ({ browserHistory, store }) =>
  <Provider store={store}>
    <ReviewsRoutes history={browserHistory} />
  </Provider>;

export default ReviewsApp;
