
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Container from '../../containers/IntelligenceContainer';
import Overview from '../../components/Intelligence/Overview';
import Business from '../../components/Intelligence/Business';
import Social from '../../components/Intelligence/Social';

const base = (path = '') => `/intelligence${path}`;

const Patients = () =>
  <Container>
    <DocumentTitle title="CareCru | Intelligence">
      <Switch>
        <Redirect exact from={base()} to={base('/overview')} />
        <Route path={base('/overview')} component={Overview} />
        <Route path={base('/business')} component={Business} />
        {/*<Route path={base('/social')} component={Social} />*/}
      </Switch>
    </DocumentTitle>
  </Container>;

export default Patients;
