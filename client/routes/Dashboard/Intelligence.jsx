
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';
import Container from '../../containers/IntelligenceContainer';

const base = (path = '') => `/intelligence${path}`;

const Routes = {
  overview: LazyRoute(() => import('../../components/Intelligence/Overview')),
  business: LazyRoute(() => import('../../components/Intelligence/Business')),
};

/*
    IMPORTANT: ALL CODE HERE IS DEPRECATED AS API ENDPOINTS HAVE BEEN REMOVED
    - Will be addressed in a specific ticket to remove this code
 */
const Patients = () => (
  <Container>
    <DocumentTitle title="CareCru | Intelligence">
      <Switch>
        <Redirect exact from={base()} to={base('/overview')} />
        <Route path={base('/overview')} component={Routes.overview} />
        <Route path={base('/business')} component={Routes.business} />
      </Switch>
    </DocumentTitle>
  </Container>
);

export default Patients;
