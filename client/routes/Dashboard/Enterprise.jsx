
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Container from '../../containers/EnterpriseContainer';
import Patients from '../../components/Enterprise/Patients';

const base = (path = '') => `/enterprise${path}`;

const EnterpriseRouter = () =>
  <Container>
    <DocumentTitle title="CareCru | Enterprise">
      <Switch>
        <Redirect exact from={base()} to={base('/patients')} />
        <Route path={base('/patients')} component={Patients} />
      </Switch>
    </DocumentTitle>
  </Container>;

export default EnterpriseRouter;
