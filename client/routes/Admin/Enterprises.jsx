import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import List from '../../components/Admin/Enterprises/List';
import Create from '../../components/Admin/Enterprises/Form';
import Accounts from './Accounts';
import Connectors from './Connectors';

const base = (path = '') => `/admin/enterprises${path}`;

const Enterprises = () => (
  <Switch>
    <Redirect exact from={base()} to={base('/list')} />
    <Route exact path={base('/list')} component={List} />
    <Route exact path={base('/create')} component={Create} />
    <Route exact path={base('/:enterpriseId/edit')} component={Create} />
  </Switch>
);

const Admin = () => (
  <DocumentTitle title="CareCru | Global Admin">
    <Switch>
      <Redirect exact from="/admin" to={base()} />
      <Route path="/admin/integrations" component={Connectors} />
      <Route path={base('/:enterpriseId/accounts')} component={Accounts} />
      <Route path={base()} component={Enterprises} />
    </Switch>
  </DocumentTitle>
);

export default Admin;
