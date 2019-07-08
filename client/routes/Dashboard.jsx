
import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import Login from '../components/Login';
import DashboardApp from '../containers/DashboardApp';
import FourZeroFour from '../components/FourZeroFour';
import LazyRoute from './LazyRoute';
import SignUp from '../components/SignUpInvite';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import withAuthProps from '../hocs/withAuthProps';
import GrqphQlSubscriptions from '../util/graphqlSubscriptions';

const Routes = {
  dashboard: LazyRoute(() => import('../components/Dashboard/index'), true),
  profile: LazyRoute(() => import('../components/Profile'), true),
  intelligence: LazyRoute(() => import('./Dashboard/Reports'), true),
  schedule: LazyRoute(() => import('./Dashboard/Schedule'), true),
  patients: LazyRoute(() => import('./Dashboard/Patients'), true),
  chat: LazyRoute(() => import('./Dashboard/Chat'), true),
  typography: LazyRoute(() => import('./Dashboard/Typography'), true),
  reputation: LazyRoute(() => import('./Dashboard/Reputation'), true),
  settings: LazyRoute(() => import('./Dashboard/Settings'), true),
  admin: LazyRoute(() => import('./Admin/Enterprises'), true),
  enterprise: LazyRoute(() => import('./Dashboard/Enterprise'), true),
  calls: LazyRoute(() => import('./Dashboard/Calls'), true),
};

const DashboardRouter = ({ history, isAuth, isSuperAdmin, withEnterprise }) => {
  const getAuthorizedRoutes = () => (
    <div>
      {GrqphQlSubscriptions.subscriptionComponents()}
      <Switch>
        <Route path="/" exact component={Routes.dashboard} />
        <Route path="/profile" component={Routes.profile} />
        <Route path="/intelligence" component={Routes.intelligence} />
        <Route path="/schedule" component={Routes.schedule} />
        <Route path="/patients" component={Routes.patients} />
        <Route path="/chat" component={Routes.chat} />
        <Route path="/calls" component={Routes.calls} />
        <Route path="/typography" component={Routes.typography} />
        <Route path="/reputation" component={Routes.reputation} />
        <Route path="/settings" component={Routes.settings} />
        {isSuperAdmin && <Route path="/admin" component={Routes.admin} />}
        {withEnterprise && (
          <Route path="/enterprise" component={Routes.enterprise} />
        )}
        <Route component={FourZeroFour} />
      </Switch>
    </div>
  );

  const Dashboard = props => (
    <DashboardApp {...props}>
      <Route
        render={() =>
          (isAuth ? (
            getAuthorizedRoutes()
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          ))
        }
      />
    </DashboardApp>
  );

  const signUp = /^\/signup\/.+$/i;
  const urlTest = signUp.test(history.location.pathname)
    ? history.location.pathname
    : '/signup';

  const reset = /^\/resetpassword\/.+$/i;
  const resetTest = reset.test(history.location.pathname)
    ? history.location.pathname
    : '/resetpassword';

  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route
            exact
            path="/login"
            render={props =>
              (isAuth ? <Redirect to="/" /> : <Login {...props} />)
            }
          />
          <Route
            exact
            path={urlTest}
            render={props =>
              (isAuth ? <Redirect to="/" /> : <SignUp {...props} />)
            }
          />
          <Route
            exact
            path="/forgot"
            render={props =>
              (isAuth ? <Redirect to="/" /> : <ForgotPassword {...props} />)
            }
          />
          <Route
            exact
            path={resetTest}
            render={props =>
              (isAuth ? <Redirect to="/" /> : <ResetPassword {...props} />)
            }
          />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
};

DashboardRouter.propTypes = {
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
};

DashboardRouter.defaultProps = {
  location: {},
};

export default withAuthProps(DashboardRouter);
