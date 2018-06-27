
import React, { PropTypes } from 'react';
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
import {
  historyShape,
  locationShape,
} from '../components/library/PropTypeShapes/routerShapes';
import PatientUser from '../entities/models/PatientUser';
import SignUp from '../components/WidgetV2/Booking/SignUp';
import SignUpConfirm from '../components/WidgetV2/Booking/SignUp/Confirm';
import ResetPassword from '../components/WidgetV2/Booking/ResetPassword';
import ResetSuccess from '../components/WidgetV2/Booking/ResetPassword/Success';
import DaysUnavailable from '../components/WidgetV2/Booking/Waitlist/DaysUnavailable';
import AdditionalInformation from '../components/WidgetV2/Booking/AdditionalInformation';
import PatientInformation from '../components/WidgetV2/Booking/PatientInformation';
import AddPatient from '../components/WidgetV2/Booking/Patient/AddPatient';
import EditPatient from '../components/WidgetV2/Booking/Patient/EditPatient';
import getParameterByName from '../components/My/PatientPage/Shared/getParameterByName';

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
        <Route
          exact
          path={b('/waitlist/select-dates')}
          component={SelectDates}
        />
        <Route
          exact
          path={b('/waitlist/select-times')}
          component={SelectTimes}
        />
        <Route
          exact
          path={b('/waitlist/remove-dates')}
          component={RemoveDates}
        />
        <Route
          exact
          path={b('/waitlist/days-unavailable')}
          component={DaysUnavailable}
        />
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
      </Switch>
    </div>
  );
};

/**
 * If the user is not authenticated and the patientUser object is not valid,
 * redirect it to the login page.
 *
 * If the user is authenticated and has a valid user,
 * but the phonenumber is not confirmed, redirect to the confirmation page.
 *
 * If all requirements listed above are true, just render the children element/component.
 *
 * @param {object} props
 */
const LoggedRoute = ({ isAuth, patientUser, children }) => {
  if (!isAuth && !patientUser) {
    return <Redirect to="../login" />;
  } else if (
    isAuth &&
    patientUser &&
    !patientUser.get('isPhoneNumberConfirmed')
  ) {
    return <Redirect to="../signup/confirm" />;
  }
  return children;
};

const EmbedRouter = ({
  match, isAuth, patientUser, location,
}) => {
  const b = (path = '') => `${match.url}${path}`;
  const params = getParameterByName('params');
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route
        path={b('/book')}
        render={props => (
          <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />
        )}
      />
      <Route
        exact
        path={b('/login')}
        component={redirectAuth(
          Login,
          isAuth,
          (location.state && location.state.nextRoute) ||
            b('/book/practitioner'),
        )}
      />
      <Route
        exact
        path={b('/signup')}
        render={redirectAuth(SignUp, isAuth, b('/book/practitioner'))}
      />
      <Route exact path={b('/signup/confirm')} render={SignUpConfirm} />
      <Route
        exact
        path={b('/reset')}
        render={redirectAuth(ResetPassword, isAuth, b('/book/practitioner'))}
      />
      <Route
        exact
        path={b('/reset-success')}
        render={redirectAuth(ResetSuccess, isAuth, b('/book/practitioner'))}
      />
      <Route
        exact
        path={b('/patient/add')}
        render={props => <AddPatient {...props} />}
      />
      <Route
        exact
        path={b('/patient/edit/:patientId')}
        render={props => <EditPatient {...props} {...params} />}
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
            render={props => (
              <EmbedRouter
                {...props}
                isAuth={isAuth}
                patientUser={patientUser}
              />
            )}
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
  }),
  patientUser: PropTypes.instanceOf(PatientUser),
};

WidgetRouter.propTypes = {
  history: PropTypes.shape(historyShape),
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.instanceOf(PatientUser),
};

EmbedRouter.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape),
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  patientUser: PropTypes.instanceOf(PatientUser),
};

LoggedRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.instanceOf(PatientUser),
};
