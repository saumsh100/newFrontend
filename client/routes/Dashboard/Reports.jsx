
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';
import Container from '../../components/Reports';

const base = (path = '') => `/reports${path}`;

const Routes = {
  bookings: LazyRoute(() => import('../../components/Reports/Bookings')),
  reminders: LazyRoute(() => import('../../components/Reports/Reminders')),
};

const Reports = () => (
  <Container>
    <DocumentTitle title="CareCru | Reports">
      <Switch>
        <Redirect exact from={base()} to={base('/bookings')} />
        <Route path={base('/bookings')} component={Routes.bookings} />
        <Route path={base('/reminders')} component={Routes.reminders} />
      </Switch>
    </DocumentTitle>
  </Container>
);

export default Reports;
