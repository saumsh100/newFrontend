import React, {PropTypes} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ConnectedRouter as Router} from 'react-router-redux';
import ReviewsWidget from '../components/ReviewsWidget';
import Review from '../components/ReviewsWidget/Review';
import Login from '../components/ReviewsWidget/Login';
import SignUp from '../components/ReviewsWidget/SignUp';
import PatientApp from '../containers/PatientApp';
import Submitted from '../components/ReviewsWidget/Review/Submitted';

const base = (path = '') => `/reviews/:accountId/embed${path}`;

const ReviewsRouter = ({ match }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Route exact path={b()} component={Review} />
      <Route exact path={b('/submitted')} component={Submitted} />
    </Switch>
  );
};

const EmbedRouter = ({ match }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route path={b('/review')} component={ReviewsRouter} />
      <Route exact path={b('/login')} component={Login} />
      <Route exact path={b('/signup')} component={SignUp} />
    </Switch>
  );
};

const WidgetRouter = ({ history }) => {
  return (
    <Router history={history}>
      <div>
        {/* TODO: Booking widget will soon become part of app */}
        <Route exact path={base('/book')} component={PatientApp} />
        {/* TODO: ReviewsWidget will ultimately become just the widget container */}
        <ReviewsWidget>
          <Switch>
            <Route path={base()} component={EmbedRouter} />
          </Switch>
        </ReviewsWidget>
      </div>
    </Router>
  );
};

WidgetRouter.propTypes = {
  history: PropTypes.object.isRequired,
};

export default WidgetRouter;
