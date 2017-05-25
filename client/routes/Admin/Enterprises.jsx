import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Container from '../../containers/EnterprisesContainer';
import List from '../../components/Admin/Enterprises/List/index';
import Create from '../../components/Admin/Enterprises/Form/index';
import Accounts from './Accounts';

const base = (path = '') => `/admin/enterprises${path}`;

const Enterprises = props =>
  <Container {...props} >
    <Switch>
      <Redirect exact from={base()} to={base('/list')} />
      <Route exact path={base('/list')} component={List} />
      <Route exact path={base('/create')} component={Create} />
      <Route exact path={base('/:enterpriseId/edit')} component={Create} />
    </Switch>
  </Container>;

const Admin = () =>
  <div>
    <Switch>
      <Redirect exact from="/admin" to={base()} />

      <Route path={base('/:enterpriseId/accounts')} component={Accounts} />
      <Route path={base()} component={Enterprises} />
    </Switch>
  </div>;

export default Admin;
