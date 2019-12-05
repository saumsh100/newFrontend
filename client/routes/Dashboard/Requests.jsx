
import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

const base = (path = '') => `/requests${path}`;

const Routes = {
  requests: lazy(() => import('../../components/Requests/Electron')),
  schedule: lazy(() => import('../../containers/ScheduleContainer')),
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
