import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Container from '../../containers/ReputationContainer';
import Reviews from '../../components/Reputation/Reviews';
import Listings from '../../components/Reputation/Listings';

const base = (path = '') => `/reputation${path}`;

const Patients = () =>
  <Container>
    <Switch>
      <Redirect exact from={base()} to={base('/reviews')} />

      <Route path={base('/reviews')} component={Reviews} />
      <Route path={base('/listings')} component={Listings} />
    </Switch>
  </Container>;

export default Patients;
