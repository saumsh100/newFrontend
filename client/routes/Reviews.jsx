
import React, { PropTypes } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import { connect } from 'react-redux';
import ReviewsWidget from '../components/ReviewsWidget';
import WidgetContainer from '../components/ReviewsWidget/Container';
// import BookingContainer from '../components/ReviewsWidget/BookingContainer';
import Login from '../components/ReviewsWidget/Login';
import SignUp from '../components/ReviewsWidget/SignUp';
import ResetPassword from '../components/ReviewsWidget/ResetPassword';
import ResetSuccess from '../components/ReviewsWidget/ResetPassword/Success';
import PatientApp from '../containers/PatientApp';
import Availabilities from '../components/ReviewsWidget/Booking/Availabilities';
import Waitlist from '../components/ReviewsWidget/Booking/Waitlist';
import BookingReview from '../components/ReviewsWidget/Booking/Review';
import BookingComplete from '../components/ReviewsWidget/Booking/Complete';
import Submitted from '../components/ReviewsWidget/Review/Submitted';
import Complete from '../components/ReviewsWidget/Review/Complete';

const base = (path = '') => `/widgets/:accountId/app${path}`;

const redirectNoAuth = (AuthComponent, isAuth, path) => (props) => {
  return isAuth ?
    <AuthComponent {...props} /> :
    <Redirect to={path} />;
};

const redirectAuth = (NoAuthComponent, isAuth, history) => (props) => {
  return isAuth ?
    null :
    <NoAuthComponent {...props} />;
};


const ReviewsRouter = ({ match }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <WidgetContainer>
      <Switch>
        {/*<Redirect exact from={b()} to={b('/submitted')} />*/}
        <Route exact path={b()} component={Submitted} />
        <Route exact path={b('/complete')} component={Complete} />
      </Switch>
    </WidgetContainer>
  );
};

const BookingRouter = ({ match, isAuth }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <div>
      <Switch>
        {/*<Redirect exact from={b()} to={b('/submitted')} />*/}
        <Route exact path={b()} component={Availabilities} />
        <Route exact path={b('/wait')} component={Waitlist} />
        <Route exact path={b('/review')} render={redirectNoAuth(BookingReview, isAuth, '../login')} />
        <Route exact path={b('/complete')} render={redirectNoAuth(BookingComplete, isAuth, '../login')} />
      </Switch>
    </div>
  );
};

const EmbedRouter = ({ match, isAuth, history }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route path={b('/review')} component={ReviewsRouter} />
      <Route path={b('/book')} render={props => <BookingRouter {...props} isAuth={isAuth} />} />
      <Route exact path={b('/login')} render={redirectAuth(Login, isAuth, history)} />
      <Route exact path={b('/signup')} render={redirectAuth(SignUp, isAuth, history)} />
      <Route exact path={b('/reset')} render={redirectAuth(ResetPassword, isAuth, history)} />
      <Route exact path={b('/reset-success')} render={redirectAuth(ResetSuccess, isAuth, history)} />
    </Switch>
  );
};

const WidgetRouter = ({ history, isAuth }) => {
  return (
    <Router history={history}>
      <div>
        {/* TODO: Booking widget will soon become part of app */}
        {/*<Route exact path={base('/book')} component={PatientApp} />*/}
        {/* TODO: ReviewsWidget will ultimately become just the widget container */}
        <ReviewsWidget>
          <Switch>
            <Route path={base()} render={props => <EmbedRouter {...props} isAuth={isAuth} />} />
          </Switch>
        </ReviewsWidget>
      </div>
    </Router>
  );
};

WidgetRouter.propTypes = {
  history: PropTypes.object.isRequired,
  isAuth: PropTypes.bool.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
  };
}

export default connect(mapStateToProps)(WidgetRouter);
