
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Switch, Route } from 'react-router-dom';
import LazyRoute from '../LazyRoute';
import FeatureFlagWrapper from '../../components/FeatureFlagWrapper';

const Routes = {
  calls: LazyRoute(() => import('../../components/Calls')),
};

const Calls = () => (
  <DocumentTitle title="CareCru | Call Tracking">
    <Switch>
      <FeatureFlagWrapper featureKey="feature-call-tracking">
        <Route path="/calls" component={Routes.calls} />
      </FeatureFlagWrapper>
    </Switch>
  </DocumentTitle>
);

export default Calls;
