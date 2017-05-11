import React, { PropTypes, Component } from 'react';

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
import Profile from '../components/Profile';
import SignUp from '../components/SignUpInvite';

const getIsAuth = () => store.getState().auth.get('isAuthenticated');

export default
class DashboardRouter extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isAuth: getIsAuth(),
    };

    this.unsubscribe = store.subscribe(() => {
      const isAuth = getIsAuth();

      if (this.state.isAuth !== isAuth) {
        this.setState({ isAuth });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { isAuth } = this.state;
    const { history } = this.props;

    const getAuthorizedRoutes = () =>
      <div>
        <Redirect exact from="/" to="/schedule" />
        <Route path="/profile" component={Profile} />
        <LazyRoute path="/intelligence" load={loadIntelligence} />
        <LazyRoute path="/schedule" load={loadSchedule} />
        <LazyRoute path="/patients" load={loadPatients} />
        <LazyRoute path="/settings" load={loadSettings} />
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
  }
}

DashboardRouter.propTypes = {
  history: PropTypes.any.required,
};
