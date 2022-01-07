import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import loadable from '@loadable/component';

const base = (path = '') => `/intelligence${path}`;

const Routes = {
  Intelligence: loadable(() => import('../../components/Reports')),
};

const Reports = () => (
  <DocumentTitle title="CareCru | Reports">
    <Switch>
      <Route path={base('/')} component={Routes.Intelligence} />
    </Switch>
  </DocumentTitle>
);

export default Reports;
