
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Container from '../../containers/SocialContainer';
import Patient from '../../components/Social/Patient';
import Practice from '../../components/Social/Practice';

const base = (path = '') => `/social${path}`;

const Patients = () => (
  <Container>
    <DocumentTitle title="CareCru | Social">
      <Switch>
        <Redirect exact from={base()} to={base('/patient')} />
        {/* <Route path={base('/patient')} component={Patient} /> */}
        <Route path={base('/practice')} component={Practice} />
      </Switch>
    </DocumentTitle>
  </Container>
);

export default Patients;
