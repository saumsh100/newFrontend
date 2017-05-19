
import { Provider } from 'react-redux';
import React from 'react';
import PatientRoutes from '../routes/Patient';
import '../styles/default.scss';

const PatientApp = ({ browserHistory, store }) =>
  <Provider store={store}>
    <PatientRoutes history={browserHistory} />
  </Provider>;

export default PatientApp;
