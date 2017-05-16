
import { Provider } from 'react-redux';
import React from 'react';
import DashboardRoutes from '../routes/Dashboard';
import '../styles/default.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const DashboardApp = ({ browserHistory, store }) =>
  <Provider store={store}>
    <DashboardRoutes history={browserHistory} />
  </Provider>;

export default DashboardApp;
