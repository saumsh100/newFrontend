
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Container from '../../containers/ReputationContainer';
import SubContainer from '../../components/Reputation/index'
import Reviews from '../../components/Reputation/Reviews';
import Listings from '../../components/Reputation/Listings';

const base = (path = '') => `/reputation${path}`;

const Reputation = (props) =>
  <SubContainer {...props}>
      <DocumentTitle title="CareCru | Reputation">
        <Switch>
          <Redirect exact from={base()} to={base('/reviews')} />
          <Route path={base('/reviews')} component={Reviews} />
          <Route path={base('/listings')} component={Listings} />
        </Switch>
      </DocumentTitle>
  </SubContainer>;

export default Reputation;
