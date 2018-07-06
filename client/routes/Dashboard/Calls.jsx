
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Switch, Route } from 'react-router-dom';
import LazyRoute from '../LazyRoute';
import EnabledFeature from '../../components/library/EnabledFeature';

const Routes = {
  calls: LazyRoute(() => import('../../components/Calls')),
};

const Calls = () => (
  <DocumentTitle title="CareCru | Call Tracking">
    <Switch>
      <EnabledFeature
        predicate={({ flags }) => flags.get('feature-call-tracking')}
        render={<Route path="/calls" component={Routes.calls} />}
      />
    </Switch>
  </DocumentTitle>
);

export default Calls;
