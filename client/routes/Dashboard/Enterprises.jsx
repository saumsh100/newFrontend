
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Container from '../../containers/EnterprisesContainer';
import List from '../../components/Enterprises/List/index';

const base = (path = '') => `/enterprises${path}`;

const Enterprises = () =>
  <Container>
    <Switch>
      <Redirect exact from={base()} to={base('/list')} />
      <Route exact to={base('/list')} component={List} />
    </Switch>
  </Container>;

export default Enterprises;
