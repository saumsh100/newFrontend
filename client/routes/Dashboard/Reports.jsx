
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';

const base = (path = '') => `/intelligence${path}`;

const Routes = {
  Intelligence: LazyRoute(() => import('../../components/Reports/')),
};

const Reports = () => (
  <DocumentTitle title="CareCru | Reports">
    <Switch>
      <Route path={base('/')} component={Routes.Intelligence} />
    </Switch>
  </DocumentTitle>
);

export default Reports;
