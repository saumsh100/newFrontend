import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';
import loadable from '@loadable/component';
import Login from '../components/Login';
import DashboardApp from '../containers/DashboardApp';
import FourZeroFour from '../components/FourZeroFour';
import SignUp from '../components/SignUpInvite';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import withAuthProps from '../hocs/withAuthProps';
import GraphQlSubscriptions from '../util/graphqlSubscriptions';
import Loader from '../components/Loader';
import { browserHistory as history } from '../store/factory';
import LoginSSO from '../components/LoginSSO';
import RecoveryTokenInvalid from '../components/ForgotPassword/ResetPassword/RecoveryTokenInvalid';
import MicroFrontendRenderer from '../micro-front-ends/MicroFrontendRenderer';

// eslint-disable-next-line import/no-unresolved
const EMApp = loadable(() => import('EM_MFE/App'));

const Routes = {
  dashboard: loadable(() => import('../components/Dashboard')),
  profile: loadable(() => import('../components/Profile')),
  intelligence: loadable(() => import('./Dashboard/Reports')),
  schedule: loadable(() => import('./Dashboard/Schedule')),
  patients: loadable(() => import('./Dashboard/Patients')),
  chat: loadable(() => import('./Dashboard/Chat')),
  typography: loadable(() => import('./Dashboard/Typography')),
  reputation: loadable(() => import('./Dashboard/Reputation')),
  settings: loadable(() => import('./Dashboard/Settings')),
  admin: loadable(() => import('./Admin/Enterprises')),
  calls: loadable(() => import('./Dashboard/Calls')),
};

const ExternalRedirector = ({
  location: {
    state: { redirectUrl },
  },
}) => {
  window.location = redirectUrl;
  return null;
};

ExternalRedirector.propTypes = {
  redirectUrl: PropTypes.string.isRequired,
};

const DashboardRouter = ({
  enterpriseManagementPhaseTwoActive,
  enterpriseManagementAuthenticationActive,
  isAuth,
  isSuperAdmin,
  isSSO,
  navigationPreferences,
}) => {
  if (!navigationPreferences) return null;

  const getNavigationPreference = (page) => navigationPreferences[page] !== 'disabled';
  const getAuthorizedRoutes = () => (
    <div>
      {GraphQlSubscriptions.subscriptionComponents()}
      <Suspense fallback={<Loader />}>
        <Switch>
          {getNavigationPreference('dashboard') && (
            <Route path="/" exact component={Routes.dashboard} />
          )}
          {getNavigationPreference('intelligence') && (
            <Route path="/intelligence" component={Routes.intelligence} />
          )}
          {getNavigationPreference('schedule') && (
            <Route path="/schedule" component={Routes.schedule} />
          )}
          {getNavigationPreference('patients') && (
            <Route path="/patients" component={Routes.patients} />
          )}
          {getNavigationPreference('chat') && <Route path="/chat" component={Routes.chat} />}
          {getNavigationPreference('calls') && <Route path="/calls" component={Routes.calls} />}
          {getNavigationPreference('marketing') && (
            <Route path="/reputation" component={Routes.reputation} />
          )}
          {getNavigationPreference('settings') && (
            <Route path="/settings" component={Routes.settings} />
          )}
          {isSuperAdmin && <Route path="/admin" component={Routes.admin} />}
          {!isSSO && !enterpriseManagementAuthenticationActive && (
            <Route path="/profile" component={Routes.profile} />
          )}
          <Route path="/typography" component={Routes.typography} />
          <Route path="/dashboard" component={() => <Redirect to="/" />} />
          <Route component={FourZeroFour} />
        </Switch>
      </Suspense>
    </div>
  );

  const Dashboard = (props) =>
    isAuth ? (
      <DashboardApp {...props}>
        <Route render={getAuthorizedRoutes} />
      </DashboardApp>
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );

  Dashboard.defaultProps = {
    location: {},
  };

  Dashboard.propTypes = {
    location: PropTypes.shape({
      assign: PropTypes.func,
      hash: PropTypes.string,
      host: PropTypes.string,
      hostname: PropTypes.string,
      href: PropTypes.string,
      origin: PropTypes.string,
      pathname: PropTypes.string,
      port: PropTypes.string,
      protocol: PropTypes.string,
      reload: PropTypes.func,
      replace: PropTypes.func,
      search: PropTypes.string,
      toString: PropTypes.func,
      valueOf: PropTypes.func,
    }),
  };

  const signUp = /^\/signup\/.+$/i;
  const urlTest = signUp.test(history.location.pathname) ? history.location.pathname : '/signup';

  const reset = /^\/resetpassword\/.+$/i;
  const resetTest = reset.test(history.location.pathname)
    ? history.location.pathname
    : '/resetpassword';

  return (
    <ConnectedRouter history={history}>
      <div
        className={classNames({
          'enterprise-management-phase-two': enterpriseManagementPhaseTwoActive,
        })}
      >
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => (isAuth ? <Redirect to="/" /> : <Login {...props} />)}
          />
          <Route
            exact
            path="/login/sso"
            render={(props) => (isAuth ? <Redirect to="/" /> : <LoginSSO {...props} />)}
          />
          <Route
            exact
            path={urlTest}
            render={(props) => (isAuth ? <Redirect to="/" /> : <SignUp {...props} />)}
          />
          <Route
            exact
            path="/forgot"
            render={(props) => (isAuth ? <Redirect to="/" /> : <ForgotPassword {...props} />)}
          />
          <Route
            exact
            path="/recovery-token-invalid"
            render={(props) => (isAuth ? <Redirect to="/" /> : <RecoveryTokenInvalid {...props} />)}
          />
          <Route
            exact
            path={resetTest}
            render={(props) => (isAuth ? <Redirect to="/" /> : <ResetPassword {...props} />)}
          />
          {enterpriseManagementPhaseTwoActive && isSuperAdmin && (
            <Route
              path="/enterprise-management"
              render={() => (
                <MicroFrontendRenderer
                  load
                  className="em-mfe-container"
                  component={<EMApp basepath="/enterprise-management" />}
                />
              )}
            />
          )}
          <Route exact path="/redirect" render={ExternalRedirector} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
};

DashboardRouter.propTypes = {
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
  enterpriseManagementAuthenticationActive: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    action: PropTypes.string,
    block: PropTypes.func,
    createHref: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    length: PropTypes.number,
    listen: PropTypes.func,
    location: PropTypes.objectOf(PropTypes.string),
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
  isSSO: PropTypes.bool,
  isAuth: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  withEnterprise: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    assign: PropTypes.func,
    hash: PropTypes.string,
    host: PropTypes.string,
    hostname: PropTypes.string,
    href: PropTypes.string,
    origin: PropTypes.string,
    pathname: PropTypes.string,
    port: PropTypes.string,
    protocol: PropTypes.string,
    reload: PropTypes.func,
    replace: PropTypes.func,
    search: PropTypes.string,
    toString: PropTypes.func,
    valueOf: PropTypes.func,
  }),
  navigationPreferences: PropTypes.shape({
    dashboard: PropTypes.string,
    intelligence: PropTypes.string,
    schedule: PropTypes.string,
    patients: PropTypes.string,
    chat: PropTypes.string,
    marketing: PropTypes.string,
    settings: PropTypes.string,
  }),
};

DashboardRouter.defaultProps = {
  isSSO: false,
  location: {},
  navigationPreferences: null,
};

const mapStateToProps = ({ featureFlags }) => {
  const enterpriseManagementPhaseTwoActive =
    process.env.NODE_ENV === 'development'
      ? true
      : featureFlags.getIn(['flags', 'enterprise-management-phase-2']) || false;
  return {
    enterpriseManagementPhaseTwoActive,
    enterpriseManagementAuthenticationActive:
      featureFlags.getIn(['flags', 'enterprise-management-authentication']) || false,
  };
};

export default withAuthProps(connect(mapStateToProps)(DashboardRouter));
