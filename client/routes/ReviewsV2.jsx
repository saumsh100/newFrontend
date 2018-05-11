
import React, { PropTypes } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import { connect } from 'react-redux';
import Widget from '../components/WidgetV2';
import Reasons from '../components/WidgetV2/Booking/Reasons';
import DateTime from '../components/WidgetV2/Booking/DateTime';
import Practitioners from '../components/WidgetV2/Booking/Practitioners';
import SelectDate from '../components/WidgetV2/Booking/Waitlist/SelectDate';
import Join from '../components/WidgetV2/Booking/Waitlist/Join';
import RemoveDates from '../components/WidgetV2/Booking/Waitlist/RemoveDates';
import { historyShape } from '../components/library/PropTypeShapes/routerShapes';
import PatientUser from '../entities/models/PatientUser';

const base = (path = '') => `/widgets/:accountId/app${path}`;

const BookingRouter = ({ match }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <div>
      <Switch>
        <Redirect exact from={b()} to={b('/practitioner')} />
        <Route exact path={b('/practitioner')} component={Practitioners} />
        <Route exact path={b('/reason')} component={Reasons} />
        <Route exact path={b('/date-and-time')} component={DateTime} />
        <Route exact path={b('/waitlist/join')} component={Join} />
        <Route exact path={b('/waitlist/select-date')} component={SelectDate} />
        <Route exact path={b('/waitlist/remove-dates')} component={RemoveDates} />
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
  } else if (isAuth && patientUser && !patientUser.get('isPhoneNumberConfirmed')) {
    return <Redirect to="../signup/confirm" />;
  }
  return children;
};

const EmbedRouter = ({ match, isAuth, patientUser }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route
        path={b('/book')}
        render={props => <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />}
      />
    </Switch>
  );
};

const WidgetRouter = ({ history, isAuth, patientUser }) => (
  <Router history={history}>
    <div>
      {/* TODO: Booking widget will soon become part of app */}
      {/* <Route exact path={base('/book')} component={PatientApp} />*/}
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
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  patientUser: PropTypes.instanceOf(PatientUser),
};

LoggedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.instanceOf(PatientUser),
};
