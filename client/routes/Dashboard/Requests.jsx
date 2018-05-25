
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';

const base = (path = '') => `/requests${path}`;

const Routes = {
  requests: LazyRoute(() => import('../../components/Requests/Electron')),
  schedule: LazyRoute(() => import('../../containers/ScheduleContainer')),
};

const Requests = () => (
  <DocumentTitle title="CareCru | Requests">
    <Switch>
      <Route exact path={base()} component={Routes.requests} />
      <Route exact path={base('/schedule')} component={Routes.schedule} />
    </Switch>
  </DocumentTitle>
);

export default Requests;
