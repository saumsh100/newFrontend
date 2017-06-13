
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Container from '../../containers/EnterpriseContainer';
import Patients from '../../components/Enterprise/Patients';

const base = (path = '') => `/enterprise${path}`;

const EnterpriseRouter = () =>
  <Container>
    <Switch>
      <Redirect exact from={base()} to={base('/patients')} />
      <Route path={base('/patients')} component={Patients} />
    </Switch>
  </Container>;

export default EnterpriseRouter;
