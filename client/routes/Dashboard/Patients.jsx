
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Container from '../../containers/PatientsContainer';
import List from '../../components/Patients/PatientTable';
import Messages from '../../containers/PatientsMessagesContainer';
import Phone from '../../containers/PatientsPhoneContainer';
import PatientInfo from '../../components/Patients/PatientInfo';

const base = (path = '') => `/patients${path}`;

const Patients = () =>
  <DocumentTitle title="CareCru | Patients">
    <Switch>
      <Redirect exact from={base()} to={base('/list')} />
      <Route path={base('/list')} component={List} />
      <Route path={base('/messages')} component={Messages} />
      <Route path={base('/phone')} component={Phone} />
      <Route path={base('/:patientId')} component={PatientInfo} />
    </Switch>
  </DocumentTitle>;

export default Patients;
