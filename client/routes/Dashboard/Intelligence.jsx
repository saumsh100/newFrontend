
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';
import Container from '../../containers/IntelligenceContainer';
import Social from '../../components/Intelligence/Social';

const base = (path = '') => `/intelligence${path}`;

const Routes = {
  overview: LazyRoute(() => import('../../components/Intelligence/Overview')),
  business: LazyRoute(() => import('../../components/Intelligence/Business')),
};

const Patients = () => (
  <Container>
    <DocumentTitle title="CareCru | Intelligence">
      <Switch>
        <Redirect exact from={base()} to={base('/overview')} />
        <Route path={base('/overview')} component={Routes.overview} />
        <Route path={base('/business')} component={Routes.business} />
        {/* <Route path={base('/social')} component={Social} /> */}
      </Switch>
    </DocumentTitle>
  </Container>
);

export default Patients;
