
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';

const base = (path = '') => `/intelligence${path}`;

const Routes = {
  growth: LazyRoute(() => import('../../components/Reports/Growth')),
  pulse: LazyRoute(() => import('../../components/Reports/Pulse')),
};

const Reports = () => (
  <DocumentTitle title="CareCru | Reports">
    <Switch>
      <Redirect exact from={base()} to={base('/growth')} />
      <Route path={base('/growth')} component={Routes.growth} />
      <Route path={base('/pulse')} component={Routes.pulse} />
    </Switch>
  </DocumentTitle>
);

export default Reports;
