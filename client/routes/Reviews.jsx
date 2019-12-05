
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Widget from '../components/Widget';
import Reasons from '../components/Widget/Booking/Reasons';
import DateTime from '../components/Widget/Booking/DateTime';
import Practitioners from '../components/Widget/Booking/Practitioners';
import SelectDates from '../components/Widget/Booking/Waitlist/SelectDates';
import SelectTimes from '../components/Widget/Booking/Waitlist/SelectTimes';
import Logon from '../components/Widget/Account/Logon';
import Account from '../components/Widget/Account';
import { historyShape, locationShape } from '../components/library/PropTypeShapes/routerShapes';
import AdditionalInformation from '../components/Widget/Booking/AdditionalInformation';
import PatientInformation from '../components/Widget/Booking/PatientInformation';
import patientUserShape from '../components/library/PropTypeShapes/patientUserShape';
import Review from '../components/Widget/Booking/Review';
import Complete from '../components/Widget/Booking/Complete';
import WidgetContainer from '../components/Widget/Container';
import Submitted from '../components/Widget/Review/Submitted';
import CompleteReview from '../components/Widget/Review/Complete';
import fade from '../styles/fade.scss';

const base = (path = '') => `/widgets/:accountId/app${path}`;

const GuestRoute = ({
  component: Component,
  isAuth,
  redirecPath,
  redirecAccountPath,
  patientUser,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuth && (patientUser && patientUser.isPhoneNumberConfirmed)) {
        return <Redirect to={redirecPath} />;
      } else if (isAuth && (patientUser && !patientUser.isPhoneNumberConfirmed)) {
        return <Redirect to={redirecAccountPath} />;
      }
      return <Component {...props} />;
    }}
  />
);

GuestRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.shape({ isPhoneNumberConfirmed: PropTypes.bool }),
  redirecPath: PropTypes.string,
  redirecAccountPath: PropTypes.string,
};

GuestRoute.defaultProps = {
  patientUser: { isPhoneNumberConfirmed: false },
  redirecPath: 'book/patient-information',
  redirecAccountPath: 'account',
};

const AuthenticatedRoute = ({
  component: Component,
  isAuth,
  patientUser,
  redirecPath,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      (!isAuth || (isAuth && (patientUser && !patientUser.isPhoneNumberConfirmed)) ? (
        <Redirect to={redirecPath} />
      ) : (
        <Component {...props} />
      ))
    }
  />
);

AuthenticatedRoute.propTypes = GuestRoute.propTypes;

AuthenticatedRoute.defaultProps = {
  patientUser: { isPhoneNumberConfirmed: false },
  redirecPath: '../login',
};

const BookingRouter = ({ match, isAuth, patientUser, location }) => {
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
          <AuthenticatedRoute
            exact
            path={b('/patient-information')}
            component={PatientInformation}
            isAuth={isAuth}
            patientUser={patientUser}
          />
          <AuthenticatedRoute
            exact
            path={b('/additional-information')}
            component={AdditionalInformation}
            isAuth={isAuth}
            patientUser={patientUser}
          />
          <AuthenticatedRoute
            exact
            path={b('/review')}
            component={Review}
            isAuth={isAuth}
            patientUser={patientUser}
          />
          <AuthenticatedRoute
            exact
            path={b('/complete')}
            component={Complete}
            isAuth={isAuth}
            patientUser={patientUser}
          />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

const ReviewsRouter = ({ match }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <WidgetContainer>
      <Switch>
        <Route exact path={b()} component={Submitted} />
        <Route exact path={b('/complete')} component={CompleteReview} />
      </Switch>
    </WidgetContainer>
  );
};

const EmbedRouter = ({ match, isAuth, patientUser }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route path={b('/review')} component={ReviewsRouter} />
      <Redirect exact from={b('/book')} to={b('/book/reason')} />
      <Route
        path={b('/book')}
        render={props => <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />}
      />
      <GuestRoute
        exact
        path={b('/login')}
        component={Logon}
        isAuth={isAuth}
        patientUser={patientUser}
      />
      <Route exact path={b('/account')} component={Account} />
    </Switch>
  );
};

const WidgetRouter = ({ history, isAuth, patientUser }) => (
  <Router history={history}>
    <div>
      <BrowserRouter>
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
      </BrowserRouter>
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

ReviewsRouter.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

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
BookingRouter.defaultProps = { patientUser: null };

BookingRouter.defaultProps = { patientUser: null };

WidgetRouter.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(patientUserShape)]),
};

WidgetRouter.defaultProps = { patientUser: null };

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
EmbedRouter.defaultProps = { patientUser: null };
