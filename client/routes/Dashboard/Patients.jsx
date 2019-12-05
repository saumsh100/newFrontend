
import React, { lazy } from 'react';
import DocumentTitle from 'react-document-title';
import { Switch, Redirect, Route } from 'react-router-dom';

const base = (path = '') => `/patients${path}`;

const Routes = {
  list: lazy(() => import('../../components/Patients/PatientTable')),
  patient: lazy(() => import('../../components/Patients/PatientInfo')),
  search: lazy(() => import('../../components/Patients/PatientSearch')),
};

const Patients = () => (
  <DocumentTitle title="CareCru | Patients">
    <Switch>
      <Redirect exact from={base()} to={base('/list')} />
      <Route path={base('/list')} component={Routes.list} />
      <Route path={base('/phone')} component={Routes.phone} />
      <Route path={base('/search')} component={Routes.search} />
      <Route path={base('/insight')} />
      <Route path={base('/:patientId')} component={Routes.patient} />
    </Switch>
  </DocumentTitle>
);

export default Patients;
