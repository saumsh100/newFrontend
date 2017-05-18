
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Container from '../../containers/EnterprisesContainer';
import List from '../../components/Enterprises/List';
import Create from '../../components/Enterprises/Form';

const base = (path = '') => `/admin/enterprises${path}`;

const Enterprises = () =>
  <Container>
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

      <Route path={base()} component={Enterprises} />
    </Switch>
  </div>;

export default Admin;
