
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import LazyRoute from '../LazyRoute';
import DocumentTitle from 'react-document-title';
import Container from '../../containers/PatientsContainer';

const base = (path = '') => `/patients${path}`;

const Routes = {
  list: LazyRoute(() => import('../../components/Patients/PatientTable')),
  phone: LazyRoute(() => import('../../containers/PatientsPhoneContainer')),
  patient: LazyRoute(() => import('../../components/Patients/PatientInfo'))
}

const Patients = () =>
  <DocumentTitle title="CareCru | Patients">
    <Switch>
      <Redirect exact from={base()} to={base('/list')} />
      <Route path={base('/list')} component={Routes.list} />
      <Route path={base('/phone')} component={Routes.phone} />
      <Route path={base('/:patientId')} component={Routes.patient} />
    </Switch>
  </DocumentTitle>;

export default Patients;
