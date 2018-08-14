
import PropTypes from 'prop-types';
import React from 'react';
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
import AddPatient from '../components/Widget/Patient/AddPatient';
import EditPatient from '../components/Widget/Patient/EditPatient';
import getParameterByName from '../components/My/PatientPage/Shared/getParameterByName';

const base = (path = '') => `/widgets/:accountId/app${path}`;

const redirectNoAuth = (AuthComponent, isAuth, path) => props =>
  (isAuth ? <AuthComponent {...props} /> : <Redirect to={path} />);

const redirectAuth = (NoAuthComponent, isAuth, path) => props =>
  (isAuth ? <Redirect to={path} /> : <NoAuthComponent {...props} />);

const ReviewsRouter = ({ match }) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <WidgetContainer>
      <Switch>
        {/* <Redirect exact from={b()} to={b('/submitted')} /> */}
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
        {/* <Redirect exact from={b()} to={b('/submitted')} /> */}
        <Route exact path={b()} component={Availabilities} />
        <Route exact path={b('/wait')} component={Waitlist} />
        <Route
          exact
          path={b('/complete')}
          render={redirectNoAuth(BookingComplete, isAuth, '../login')}
        />
        <LoggedRoute isAuth={isAuth} patientUser={patientUser}>
          <Route
            exact
            path={b('/review')}
            render={props => <BookingReview {...props} />}
          />
        </LoggedRoute>
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

const PatientRouter = ({ match, isAuth, patientUser }) => {
  const b = (path = '') => `${match.url}${path}`;
  const params = getParameterByName('params');
  return (
    <div>
      <Switch>
        <Route
          exact
          path={b('/add')}
          render={props => <AddPatient {...props} />}
        />
        <Route
          exact
          path={b('/edit/:patientId')}
          render={props => <EditPatient {...props} {...params} />}
        />
      </Switch>
    </div>
  );
};

const EmbedRouter = ({
  match, isAuth, patientUser, history,
}) => {
  const b = (path = '') => `${match.url}${path}`;
  return (
    <Switch>
      <Redirect exact from={b()} to={b('/review')} />
      <Route path={b('/review')} component={ReviewsRouter} />
      <Route
        path={b('/book')}
        render={props => (
          <BookingRouter {...props} isAuth={isAuth} patientUser={patientUser} />
        )}
      />
      <Route
        path={b('/patient')}
        render={props => (
          <LoggedRoute isAuth={isAuth} patientUser={patientUser}>
            <PatientRouter {...props} />
          </LoggedRoute>
        )}
      />
      <Route
        exact
        path={b('/login')}
        render={redirectAuth(Login, isAuth, b('/book'))}
      />
      <Route
        exact
        path={b('/signup')}
        render={redirectAuth(SignUp, isAuth, b('/book'))}
      />
      <Route exact path={b('/signup/confirm')} component={ConfirmSignUp} />
      <Route
        exact
        path={b('/reset')}
        render={redirectAuth(ResetPassword, isAuth, b('/book'))}
      />
      <Route
        exact
        path={b('/reset-success')}
        render={redirectAuth(ResetSuccess, isAuth, b('/book'))}
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
