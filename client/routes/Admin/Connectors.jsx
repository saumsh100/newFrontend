
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, Route } from 'react-router-dom';
import Connectors from '../../components/Admin/Connectors';

const base = (path = '') => `/admin/nasa${path}`;

const ConnectorsRoutes = props => (
  <Switch>
    <Route exact path={base()} component={Connectors} />
  </Switch>
);

ConnectorsRoutes.propTypes = {};

export default ConnectorsRoutes;
