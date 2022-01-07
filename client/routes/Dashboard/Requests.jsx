import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import loadable from '@loadable/component';

const base = (path = '') => `/requests${path}`;

const Routes = {
  schedule: loadable(() => import('../../containers/ScheduleContainer')),
};

const Requests = () => (
  <DocumentTitle title="CareCru | Requests">
    <Switch>
      <Route exact path={base('/schedule')} component={Routes.schedule} />
    </Switch>
  </DocumentTitle>
);

export default Requests;
