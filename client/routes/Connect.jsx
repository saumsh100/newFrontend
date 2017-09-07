
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import Login from '../components/Connect/Login';
import ConnectSettings from '../components/Connect/Settings';
import ConnectPanel from '../components/Connect/Panel';
import ConnectContainer from '../components/Connect';
import AuthorizedContainer from '../components/Connect/Authorized';
import FourZeroFour from '../components/FourZeroFour';
import withAuthProps from '../hocs/withAuthProps';

const ConnectRouter = ({ history, isAuth, isSuperAdmin, withEnterprise }) => {
  const getAuthorizedRoutes = () =>
    <AuthorizedContainer>
      <Switch>
        <Redirect exact from="/" to="/settings" />
        <Route path="/settings" component={ConnectSettings} />
        <Route path="/panel" component={ConnectPanel} />
        {/* isSuperAdmin ? (<LazyRoute path="/admin" load={loadAdmin} name="admin" />) : null */}
        {/* withEnterprise ? (<LazyRoute path="/enterprise" load={loadEnterprise} name="enterprise" />) : null */}
        <Route component={FourZeroFour} />
      </Switch>
    </AuthorizedContainer>;

  const Connect = props =>
    <Route
      render={() => (isAuth ?
          getAuthorizedRoutes() :
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )}
    />;

  return (
    <Router history={history}>
      <ConnectContainer>
        <Switch>
          <Route exact path="/login" render={props => (isAuth ? <Redirect to="/" /> : <Login {...props} />)} />
          <Route path="/" component={Connect} />
        </Switch>
      </ConnectContainer>
    </Router>
  );
};

ConnectRouter.propTypes = {
  history: PropTypes.object.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  withEnterprise: PropTypes.bool.isRequired,
};

export default withAuthProps(ConnectRouter);
