
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Switch, Redirect, Route } from 'react-router-dom';
import LazyRoute from '../LazyRoute';

const base = (path = '') => `/patients${path}`;

const Routes = {
  list: LazyRoute(() => import('../../components/Patients/PatientTable')),
  patient: LazyRoute(() => import('../../components/Patients/PatientInfo')),
};

const Patients = () => (
  <DocumentTitle title="CareCru | Patients">
    <Switch>
      <Redirect exact from={base()} to={base('/list')} />
      <Route path={base('/list')} component={Routes.list} />
      <Route path={base('/:patientId')} component={Routes.patient} />
    </Switch>
  </DocumentTitle>
);

export default Patients;
