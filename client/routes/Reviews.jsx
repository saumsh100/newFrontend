
import React, { PropTypes } from 'react';
import { MemoryRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import ReviewsWidget from '../components/ReviewsWidget';
import Review from '../components/ReviewsWidget/Review';
import Login from '../components/ReviewsWidget/Login';
import SignUp from '../components/ReviewsWidget/SignUp';
import Submitted from '../components/ReviewsWidget/Submitted';

const ReviewsRouter = ({ history }) => {
  return (
    <Router history={history}>
      <div>
        {/*<Route component={ReviewsWidget} />*/}
        <ReviewsWidget>
          <MemoryRouter
            initialEntries={['/review', '/signup', '/login', '/submitted']}
            initialIndex={0}
          >
            <div>
              <Route path="/review" component={Review} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/submitted" component={Submitted} />
            </div>
          </MemoryRouter>
        </ReviewsWidget>
      </div>
    </Router>
  );
};

ReviewsRouter.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ReviewsRouter;
