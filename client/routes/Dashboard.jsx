
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import Login from '../components/Login';
import DashboardApp from '../containers/DashboardApp';
import DashboardComponent from '../components/Dashboard';
import FourZeroFour from '../components/FourZeroFour';
import LazyRoute from './LazyRoute';
import loadSchedule from 'bundle-loader?lazy!./Dashboard/Schedule';
import loadIntelligence from 'bundle-loader?lazy!./Dashboard/Intelligence';
import loadPatients from 'bundle-loader?lazy!./Dashboard/Patients';
import loadSettings from 'bundle-loader?lazy!./Dashboard/Settings';
import loadSocial from 'bundle-loader?lazy!./Dashboard/Social';
import loadReputatuion from 'bundle-loader?lazy!./Dashboard/Reputation';
import loadAdmin from 'bundle-loader?lazy!./Admin/Enterprises';
import Profile from '../components/Profile';
import SignUp from '../components/SignUpInvite';

const DashboardRouter = ({ history, isAuth, isSuperAdmin }) => {
  const getAuthorizedRoutes = () =>
    <div>
      <Switch>
        <Route exact path="/" component={DashboardComponent} />
        <Route path="/profile" component={Profile} />
        <LazyRoute path="/intelligence" load={loadIntelligence} name="intelligence" />
        <LazyRoute path="/schedule" load={loadSchedule} name="schedule" />
        <LazyRoute path="/patients" load={loadPatients} name="patients" />
        <LazyRoute path="/social" load={loadSocial} name="social" />
        <LazyRoute path="/reputation" load={loadReputatuion} name="reputation" />
        <LazyRoute path="/settings" load={loadSettings} name="settings" />
        { isSuperAdmin ? (<LazyRoute path="/admin" load={loadAdmin} name="admin" />) : null }
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

  return (
    <Router history={history}>
      <div>
        <Switch>
          <Route exact path="/login" render={props => (isAuth ? <Redirect to="/" /> : <Login {...props} />)} />
          <Route exact path="/signup" render={props => (isAuth ? <Redirect to="/" /> : <SignUp {...props} />)} />
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
};

const mapStoreToProps = (state) => {
  const token = state.auth.get('token');

  return {
    isAuth: state.auth.get('isAuthenticated'),
    isSuperAdmin: (token && token.get('role')) === 'SUPERADMIN',
  };
};
export default connect(mapStoreToProps)(DashboardRouter);
