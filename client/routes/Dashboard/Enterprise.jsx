import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import loadable from '@loadable/component';
import Container from '../../containers/EnterpriseContainer';

const base = (path = '') => `/enterprise${path}`;

const Routes = {
  patients: loadable(() => import('../../components/Enterprise/Patients')),
};

const EnterpriseRouter = () => (
  <Container>
    <DocumentTitle title="CareCru | Enterprise">
      <Switch>
        <Redirect exact from={base()} to={base('/patients')} />
        <Route path={base('/patients')} component={Routes.patients} />
      </Switch>
    </DocumentTitle>
  </Container>
);

export default EnterpriseRouter;
