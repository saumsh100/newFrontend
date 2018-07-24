
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Widget from '../components/WidgetV2';
import Reasons from '../components/WidgetV2/Booking/Reasons';
import DateTime from '../components/WidgetV2/Booking/DateTime';
import Practitioners from '../components/WidgetV2/Booking/Practitioners';
import SelectDates from '../components/WidgetV2/Booking/Waitlist/SelectDates';
import SelectTimes from '../components/WidgetV2/Booking/Waitlist/SelectTimes';
import Logon from '../components/WidgetV2/Account/Logon';
import Account from '../components/WidgetV2/Account';
import { historyShape, locationShape } from '../components/library/PropTypeShapes/routerShapes';
import AdditionalInformation from '../components/WidgetV2/Booking/AdditionalInformation';
import PatientInformation from '../components/WidgetV2/Booking/PatientInformation';
import patientUserShape from '../components/library/PropTypeShapes/patientUserShape';
import Review from '../components/WidgetV2/Booking/Review';
import Complete from '../components/WidgetV2/Booking/Complete';
import fade from '../styles/fade.scss';

const base = (path = '') => `/widgets/:accountId/app${path}`;

// const redirectAuth = (NoAuthComponent, isAuth, path) => props =>
//   (isAuth ? <Redirect to={path} /> : <NoAuthComponent {...props} />);

const redirectNoAuth = (AuthComponent, { isAuth, patientUser }, path) => (props) => {
  if (!isAuth) return <Redirect to={path} />;
  if (patientUser && !patientUser.isPhoneNumberConfirmed) {
    return <Redirect to="../signup/confirm" />;
  }
  return <AuthComponent {...props} />;
};
const BookingRouter = ({
  match, isAuth, patientUser, location,
}) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames={fade} timeout={200}>
        <Switch location={location}>
          <Route exact path={b('/reason')} component={Reasons} />
          <Route exact path={b('/practitioner')} component={Practitioners} />
          <Route path={b('/date-and-time')} component={DateTime} />
          <Route exact path={b('/waitlist/select-dates')} component={SelectDates} />
          <Route exact path={b('/waitlist/select-times')} component={SelectTimes} />
          <Route
            exact
            path={b('/patient-information')}
            component={redirectNoAuth(PatientInformation, { isAuth, patientUser }, '../login')}
          />
          <Route
            exact
            path={b('/additional-information')}
            component={redirectNoAuth(AdditionalInformation, { isAuth, patientUser }, '../login')}
          />
          <Route
            exact
            path={b('/review')}
            component={redirectNoAuth(Review, { isAuth, patientUser }, '../login')}
          />
          <Route
            exact
            path={b('/complete')}
            component={redirectNoAuth(Complete, { isAuth, patientUser }, '../login')}
          />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

const EmbedRouter = ({ match, isAuth, patientUser }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Redirect exact from={b('/book')} to={b('/book/reason')} />
      <Route
        path={b('/book')}
        render={props => <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />}
      />
      <Route exact path={b('/login')} component={Logon} />
      <Route exact path={b('/account')} component={Account} />
      {/* redirectAuth(
          Logon,
          isAuth,
          (location.state && location.state.nextRoute) || b('/book/patient-information'),
        )
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
      /> */}
    </Switch>
  );
};

const WidgetRouter = ({ history, isAuth, patientUser }) => (
  <Router history={history}>
    <div>
      {/* TODO: Booking widget will soon become part of app */}
      {/* <Route exact path={base('/book')} component={PatientApp} /> */}
      <Widget>
        {state => (
          <Switch
            location={{
              ...history.location,
              state: {
                ...history.location.state,
                ...state.tabState,
                ...state.tabs,
              },
            }}
          >
            <Route
              path={base()}
              render={props => <EmbedRouter {...props} isAuth={isAuth} patientUser={patientUser} />}
            />
          </Switch>
        )}
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
  location: PropTypes.shape(locationShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(patientUserShape)]),
};
BookingRouter.defaultProps = {
  patientUser: null,
};

BookingRouter.defaultProps = {
  patientUser: null,
};

WidgetRouter.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(patientUserShape)]),
};

WidgetRouter.defaultProps = {
  patientUser: null,
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
  patientUser: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(patientUserShape)]),
};
EmbedRouter.defaultProps = {
  patientUser: null,
};
