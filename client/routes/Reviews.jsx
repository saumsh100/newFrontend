
import React, { PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import ReviewsWidget from '../components/ReviewsWidget';

const ReviewsRouter = ({ history }) => {
  return (
    <Router history={history}>
      <div>
        <Route component={ReviewsWidget} />
      </div>
    </Router>
  );
};

ReviewsRouter.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ReviewsRouter;
