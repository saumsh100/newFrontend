import React from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Login from '../components/Login';
import DashboardApp from '../containers/DashboardApp';
import FourZeroFour from '../components/FourZeroFour';
import LazyRoute from './LazyRoute';

import loadSchedule from 'bundle-loader?lazy!./Dashboard/Schedule';
import loadIntelligence from 'bundle-loader?lazy!./Dashboard/Intelligence';
import loadPatients from 'bundle-loader?lazy!./Dashboard/Patients';
import loadSettings from 'bundle-loader?lazy!./Dashboard/Settings';
import Profile from '../components/Profile';


const DashboardRouter = () => {
  const Dashboard = props =>
    <DashboardApp {...props}>
      <Switch>
        <Redirect exact from="/" to="/schedule" />

        <Route path="/profile" component={Profile} />
        <LazyRoute path="/intelligence" load={loadIntelligence} />
        <LazyRoute path="/schedule" load={loadSchedule} />
        <LazyRoute path="/patients" load={loadPatients} />
        <LazyRoute path="/settings" load={loadSettings} />
      </Switch>
    </DashboardApp>;

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />

          <Route path="/" component={Dashboard} />
          <Route component={FourZeroFour} />
        </Switch>
      </div>
    </Router>
  );
};

export default DashboardRouter;
