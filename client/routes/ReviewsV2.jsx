
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import { connect } from 'react-redux';
import Widget from '../components/WidgetV2';
import Reasons from '../components/WidgetV2/Booking/Reasons';
import DateTime from '../components/WidgetV2/Booking/DateTime';
import Practitioners from '../components/WidgetV2/Booking/Practitioners';
import SelectDates from '../components/WidgetV2/Booking/Waitlist/SelectDates';
import SelectTimes from '../components/WidgetV2/Booking/Waitlist/SelectTimes';
import Join from '../components/WidgetV2/Booking/Waitlist/Join';
import Login from '../components/WidgetV2/Booking/Login';
import RemoveDates from '../components/WidgetV2/Booking/Waitlist/RemoveDates';
import { historyShape, locationShape } from '../components/library/PropTypeShapes/routerShapes';
import SignUp from '../components/WidgetV2/Booking/SignUp';
import SignUpConfirm from '../components/WidgetV2/Booking/SignUp/Confirm';
import ResetPassword from '../components/WidgetV2/Booking/ResetPassword';
import ResetSuccess from '../components/WidgetV2/Booking/ResetPassword/Success';
import DaysUnavailable from '../components/WidgetV2/Booking/Waitlist/DaysUnavailable';
import AdditionalInformation from '../components/WidgetV2/Booking/AdditionalInformation';
import PatientInformation from '../components/WidgetV2/Booking/PatientInformation';
import Review from '../components/WidgetV2/Booking/Review';
import patientUserShape from '../components/library/PropTypeShapes/patientUserShape';

const base = (path = '') => `/widgets/:accountId/app${path}`;

const redirectAuth = (NoAuthComponent, isAuth, path) => props =>
  (isAuth ? <Redirect to={path} /> : <NoAuthComponent {...props} />);

const redirectNoAuth = (AuthComponent, isAuth, path) => props =>
  (isAuth ? <AuthComponent {...props} /> : <Redirect to={path} />);

const BookingRouter = ({ match, isAuth }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <div>
      <Switch>
        <Redirect exact from={b()} to={b('/practitioner')} />
        <Route exact path={b('/practitioner')} component={Practitioners} />
        <Route exact path={b('/reason')} component={Reasons} />
        <Route exact path={b('/date-and-time')} component={DateTime} />
        <Route exact path={b('/waitlist/join')} component={Join} />
        <Route exact path={b('/waitlist/select-dates')} component={SelectDates} />
        <Route exact path={b('/waitlist/select-times')} component={SelectTimes} />
        <Route exact path={b('/waitlist/remove-dates')} component={RemoveDates} />
        <Route exact path={b('/waitlist/days-unavailable')} component={DaysUnavailable} />
        <Route
          exact
          path={b('/patient-information')}
          component={redirectNoAuth(PatientInformation, isAuth, '../login')}
        />
        <Route
          exact
          path={b('/additional-information')}
          component={redirectNoAuth(AdditionalInformation, isAuth, '../login')}
        />
        <Route exact path={b('/review')} component={redirectNoAuth(Review, isAuth, '../login')} />
      </Switch>
    </div>
  );
};

const EmbedRouter = ({
  match, isAuth, patientUser, location,
}) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route
        path={b('/book')}
        render={props => <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />}
      />
      <Route
        exact
        path={b('/login')}
        component={redirectAuth(
          Login,
          isAuth,
          (location.state && location.state.nextRoute) || b('/book/patient-information'),
        )}
      />
      <Route
        exact
        path={b('/signup')}
        render={redirectAuth(SignUp, isAuth, b('/book/patient-information'))}
      />
      <Route exact path={b('/signup/confirm')} render={SignUpConfirm} />
      <Route
        exact
        path={b('/reset')}
        render={redirectAuth(ResetPassword, isAuth, b('/book/patient-information'))}
      />
      <Route
        exact
        path={b('/reset-success')}
        render={redirectAuth(ResetSuccess, isAuth, b('/book/patient-information'))}
      />
    </Switch>
  );
};

const WidgetRouter = ({ history, isAuth, patientUser }) => (
  <Router history={history}>
    <div>
      {/* TODO: Booking widget will soon become part of app */}
      {/* <Route exact path={base('/book')} component={PatientApp} /> */}
      <Widget>
        <Switch>
          <Route
            path={base()}
            render={props => <EmbedRouter {...props} isAuth={isAuth} patientUser={patientUser} />}
          />
        </Switch>
      </Widget>
    </div>
  </Router>
);

function mapStateToProps({ auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
    patientUser: auth.get('patientUser'),
  };
}

export default connect(mapStateToProps)(WidgetRouter);

BookingRouter.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

WidgetRouter.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.shape(patientUserShape).isRequired,
};

EmbedRouter.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  patientUser: PropTypes.shape(patientUserShape).isRequired,
};
