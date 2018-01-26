
import React, { PropTypes } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import { connect } from 'react-redux';
import Widget from '../components/Widget';
import WidgetContainer from '../components/Widget/Container';
// import BookingContainer from '../components/Widget/BookingContainer';
import Login from '../components/Widget/Login';
import SignUp from '../components/Widget/SignUp';
import ConfirmSignUp from '../components/Widget/ConfirmSignUp';
import ResetPassword from '../components/Widget/ResetPassword';
import ResetSuccess from '../components/Widget/ResetPassword/Success';
// import PatientApp from '../containers/PatientApp';
import Availabilities from '../components/Widget/Booking/Availabilities';
import Waitlist from '../components/Widget/Booking/Waitlist';
import BookingReview from '../components/Widget/Booking/Review';
import BookingComplete from '../components/Widget/Booking/Complete';
import Submitted from '../components/Widget/Review/Submitted';
import Complete from '../components/Widget/Review/Complete';

const base = (path = '') => `/widgets/:accountId/app${path}`;

const redirectNoAuth = (AuthComponent, isAuth, path) => (props) => {
  return isAuth ?
    <AuthComponent {...props} /> :
    <Redirect to={path} />;
};

const redirectAuth = (NoAuthComponent, isAuth, path) => (props) => {
  return isAuth ?
    (<Redirect to={path} />) :
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

const BookingRouter = ({ match, isAuth, patientUser }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <div>
      <Switch>
        {/*<Redirect exact from={b()} to={b('/submitted')} />*/}
        <Route exact path={b()} component={Availabilities} />
        <Route exact path={b('/wait')} component={Waitlist} />
        <Route exact path={b('/review')} render={(props) => {
          // If authed, check phoneNumber and go to appropriate step
          // If not, go to login
          return isAuth && patientUser ?
            (patientUser.get('isPhoneNumberConfirmed') ? <BookingReview {...props} /> : <Redirect to="../signup/confirm" />) :
            <Redirect to="../login" />;
        }} />
        <Route exact path={b('/complete')} render={redirectNoAuth(BookingComplete, isAuth, '../login')} />
      </Switch>
    </div>
  );
};

const EmbedRouter = ({ match, isAuth, patientUser, history }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route path={b('/review')} component={ReviewsRouter} />
      <Route path={b('/book')} render={props => <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />} />
      <Route exact path={b('/login')} render={redirectAuth(Login, isAuth, b('/book'))} />
      <Route exact path={b('/signup')} render={redirectAuth(SignUp, isAuth, b('/book'))} />
      <Route exact path={b('/signup/confirm')} component={ConfirmSignUp} />
      <Route exact path={b('/reset')} render={redirectAuth(ResetPassword, isAuth, b('/book'))} />
      <Route exact path={b('/reset-success')} render={redirectAuth(ResetSuccess, isAuth, b('/book'))} />
    </Switch>
  );
};

const WidgetRouter = ({ history, isAuth, patientUser }) => {
  return (
    <Router history={history}>
      <div>
        {/* TODO: Booking widget will soon become part of app */}
        {/*<Route exact path={base('/book')} component={PatientApp} />*/}
        <Widget>
          <Switch>
            <Route path={base()} render={props => <EmbedRouter {...props} isAuth={isAuth} patientUser={patientUser} />} />
          </Switch>
        </Widget>
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
    patientUser: auth.get('patientUser'),
  };
}

export default connect(mapStateToProps)(WidgetRouter);
