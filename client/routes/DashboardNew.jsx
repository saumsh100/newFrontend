
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import Login from '../components/Login';
import DashboardApp from '../containers/DashboardApp';
import FourZeroFour from '../components/FourZeroFour';
import LazyRoute from './LazyRoute';
import loadSchedule from 'bundle-loader?lazy!./Dashboard/Schedule';
import loadIntelligence from 'bundle-loader?lazy!./Dashboard/Intelligence';
import loadPatients from 'bundle-loader?lazy!./Dashboard/Patients';
import loadSettings from 'bundle-loader?lazy!./Dashboard/Settings';
import loadSocial from 'bundle-loader?lazy!./Dashboard/Social';
import loadReputatuion from 'bundle-loader?lazy!./Dashboard/Reputation';
import Profile from '../components/Profile';
import SignUp from '../components/SignUpInvite';

const DashboardRouter = ({ history, isAuth }) => {
  const getAuthorizedRoutes = () =>
    <div>
      <Redirect exact from="/" to="/schedule" />
      <Route path="/profile" component={Profile} />
      <LazyRoute path="/intelligence" load={loadIntelligence} name="intelligence" />
      <LazyRoute path="/schedule" load={loadSchedule} name="schedule" />
      <LazyRoute path="/patients" load={loadPatients} name="patients" />
      <LazyRoute path="/settings" load={loadSettings} name="settings" />
      <LazyRoute path="/social" load={loadSocial} name="social" />
      <LazyRoute path="/reputation" load={loadReputatuion} name="reputation" />
    </div>;

  const Dashboard = props =>
    <DashboardApp {...props}>
      <Switch>
        <Route
          render={() => (isAuth ?
              getAuthorizedRoutes() :
              <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )}
        />
        <Route component={FourZeroFour} />
      </Switch>
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
};

const mapStoreToProps = state => ({ isAuth: state.auth.get('isAuthenticated') });
export default connect(mapStoreToProps)(DashboardRouter);
