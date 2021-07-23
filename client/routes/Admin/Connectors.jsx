import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Connectors from '../../components/Admin/Connectors';

const base = (path = '') => `/admin/integrations${path}`;

const ConnectorsRoutes = () => (
  <Switch>
    <Route exact path={base()} component={Connectors} />
  </Switch>
);

ConnectorsRoutes.propTypes = {};

export default ConnectorsRoutes;
