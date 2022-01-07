import React from 'react';
import DocumentTitle from 'react-document-title';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import EnabledFeature from '../../components/library/EnabledFeature';

const Routes = {
  calls: loadable(() => import('../../components/Calls')),
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
