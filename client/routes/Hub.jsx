
import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from '../components/Login/Electron';
import HubApp from '../containers/HubApp';
import FourZeroFour from '../components/FourZeroFour';
import SignUp from '../components/SignUpInvite';
import ForgotPassword from '../components/ForgotPassword/Electron';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import withAuthProps from '../hocs/withAuthProps';
import titleGenerator from '../util/hubTitleGenerator';
import { setTitle, setBackHandler } from '../reducers/electron';
import { collapseContent, collapseWithoutResizing } from '../thunks/electron';

const Routes = {
  patients: lazy(() => import('./Dashboard/Patients'), true),
  chat: lazy(() => import('./Dashboard/Chat'), true),
  requests: lazy(() => import('./Dashboard/Requests'), true),
  shortcuts: lazy(() => import('../components/Shortcuts'), true),
  intercom: lazy(() => import('../components/EmbeddedIntercom'), true),
  waitList: lazy(() => import('../components/Waitlist'), true),
};

const HubRouter = (properties) => {
  const { history, isAuth, isSuperAdmin, withEnterprise } = properties;

  history.listen((route) => {
    const { pathname } = route;
    const title = titleGenerator(pathname);
    console.log(`Navigating to ${pathname}`);

    if (pathname.indexOf('/intercom') > -1) {
      properties.collapseWithoutResizing();
    }

    properties.setBackHandler(null);
    if (title) {
      properties.setTitle(title);
    }
  });

  window.Intercom('onHide', () => {
    if (history.location.pathname === '/intercom') {
      properties.collapseContent();
    }
  });

  const getAuthorizedRoutes = () => (
    <Switch>
      <Route path="/patients" component={Routes.patients} />
      <Route path="/chat" component={Routes.chat} />
      <Route path="/requests" component={Routes.requests} />
      <Route path="/phone-calls" />
      <Route path="/waitlist" />
      <Route path="/marketing" />
      <Route path="/intercom" component={Routes.intercom} />
      <Route path="/shortcuts" component={Routes.shortcuts} />
      {isSuperAdmin && <Route path="/admin" component={Routes.admin} />}
      {withEnterprise && <Route path="/enterprise" component={Routes.enterprise} />}
      <Route component={FourZeroFour} />
    </Switch>
  );

  const Dashboard = ownProps => (
    <HubApp {...ownProps}>
      <Route
        render={() =>
          (isAuth ? (
            getAuthorizedRoutes()
          ) : (
            <Redirect to={{ pathname: '/login',
state: { from: ownProps.location } }} />
          ))
        }
      />
    </HubApp>
  );

  const signUp = /^\/signup\/.+$/i;
  const urlTest = signUp.test(history.location.pathname) ? history.location.pathname : '/signup';

  const reset = /^\/resetpassword\/.+$/i;
  const resetTest = reset.test(history.location.pathname)
    ? history.location.pathname
    : '/resetpassword';

  return (
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route
            exact
            path="/login"
            render={props => (isAuth ? <Redirect to="/" /> : <Login {...props} />)}
          />
          <Route
            exact
            path={urlTest}
            render={props => (isAuth ? <Redirect to="/" /> : <SignUp {...props} />)}
          />
          <Route
            exact
            path="/forgot"
            render={props => (isAuth ? <Redirect to="/" /> : <ForgotPassword {...props} />)}
          />
          <Route
            exact
            path={resetTest}
            render={props => (isAuth ? <Redirect to="/" /> : <ResetPassword {...props} />)}
          />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
};

HubRouter.propTypes = {
  history: PropTypes.shape({
    listen: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }).isRequired,
  isAuth: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  withEnterprise: PropTypes.bool.isRequired,
  setTitle: PropTypes.func.isRequired,
  collapseContent: PropTypes.func.isRequired,
  collapseWithoutResizing: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setTitle,
      setBackHandler,
      collapseContent,
      collapseWithoutResizing,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(withAuthProps(HubRouter));
