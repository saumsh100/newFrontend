
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import Login from '../components/Login';
import DashboardApp from '../containers/DashboardApp';
import DashboardComponent from '../components/Dashboard/index';
import FourZeroFour from '../components/FourZeroFour';
import LazyRoute from './LazyRoute';
import loadSchedule from 'bundle-loader?lazy!./Dashboard/Schedule';
import loadIntelligence from 'bundle-loader?lazy!./Dashboard/Intelligence';
import loadPatients from 'bundle-loader?lazy!./Dashboard/Patients';
import ChatContainer from '../components/Chat';
import loadSettings from 'bundle-loader?lazy!./Dashboard/Settings';
import loadTypography from 'bundle-loader?lazy!./Dashboard/Typography';
import loadSocial from 'bundle-loader?lazy!./Dashboard/Social';
import loadReputation from 'bundle-loader?lazy!./Dashboard/Reputation';
import loadAdmin from 'bundle-loader?lazy!./Admin/Enterprises';
import loadEnterprise from 'bundle-loader?lazy!./Dashboard/Enterprise';
import Profile from '../components/Profile';
import SignUp from '../components/SignUpInvite';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import withAuthProps from '../hocs/withAuthProps';

const DashboardRouter = ({ history, isAuth, isSuperAdmin, withEnterprise }) => {
  const getAuthorizedRoutes = () =>
    <div>
      <Switch>
        <Route exact path="/" component={DashboardComponent} />
        <Route path="/profile" component={Profile} />
        <LazyRoute path="/intelligence" load={loadIntelligence} name="intelligence" />
        <LazyRoute path="/schedule" load={loadSchedule} name="schedule" disableLoader />
        <LazyRoute path="/patients" load={loadPatients} name="patients" disableLoader />
        <Route path="/chat" component={ChatContainer} />
        <LazyRoute path="/typography" load={loadTypography} name="typography" />

        {/*<LazyRoute path="/social" load={loadSocial} name="social" />*/}
        <LazyRoute path="/reputation" load={loadReputation} name="reputation" />
        <LazyRoute path="/settings" load={loadSettings} name="settings" />
        { isSuperAdmin ? (<LazyRoute path="/admin" load={loadAdmin} name="admin" />) : null }
        { withEnterprise ? (<LazyRoute path="/enterprise" load={loadEnterprise} name="enterprise" />) : null }
        <Route component={FourZeroFour} />
      </Switch>
    </div>;

  const Dashboard = props =>
    <DashboardApp {...props}>
      <Route
        render={() => (isAuth ?
            getAuthorizedRoutes() :
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )}
      />
    </DashboardApp>;

  const signUp = /^\/signup\/.+$/i;
  const urlTest = (signUp.test(history.location.pathname) ? history.location.pathname : '/signup');

  const reset = /^\/resetpassword\/.+$/i;
  const resetTest = (reset.test(history.location.pathname) ? history.location.pathname : '/resetpassword');

  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route exact path="/login" render={props => (isAuth ? <Redirect to="/" /> : <Login {...props} />)} />
          <Route exact path={urlTest} render={props => (isAuth ? <Redirect to="/" /> : <SignUp {...props} />)} />
          <Route exact path="/forgot" render={props => (isAuth ? <Redirect to="/" /> : <ForgotPassword {...props} />)} />
          <Route exact path={resetTest} render={props => (isAuth ? <Redirect to="/" /> : <ResetPassword {...props} />)} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
};

DashboardRouter.propTypes = {
  history: PropTypes.object.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  withEnterprise: PropTypes.bool.isRequired,
};

export default withAuthProps(DashboardRouter);
