
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import LazyRoute from '../LazyRoute';
import Container from '../../containers/ReputationContainer';
import SubContainer from '../../components/Reputation/index'

const base = (path = '') => `/reputation${path}`;

const Routes = {
  reviews: LazyRoute(() => import('../../components/Reputation/Reviews')),
  listings: LazyRoute(() => import('../../components/Reputation/Listings'))
}

const Reputation = (props) =>
  <SubContainer {...props}>
      <DocumentTitle title="CareCru | Reputation">
        <Switch>
          <Redirect exact from={base()} to={base('/reviews')} />
          <Route path={base('/reviews')} component={Routes.reviews} />
          <Route path={base('/listings')} component={Routes.listings} />
        </Switch>
      </DocumentTitle>
  </SubContainer>;

export default Reputation;
