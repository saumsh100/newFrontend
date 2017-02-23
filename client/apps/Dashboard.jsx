
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jwt from 'jwt-decode';
import socket from '../socket';
import connectSocketToStore from '../socket/connectSocketToStore';
import DashboardRoutes from '../routes/Dashboard';
import configure from '../store';
//import loadInitialData from '../../utilities/loadInitialData';
import { loginSuccess } from '../actions/auth';
import '../styles/dashboard.scss';

const store = configure({ browserHistory });
const history = syncHistoryWithStore(browserHistory, store);
// loadInitialData(store);

// TODO: below will call a flash with Login, perhaps fix with background color?
const token = localStorage.getItem('token');
if (!token) {
  browserHistory.push('/login');
} else {
  const decodedToken = jwt(token);

  // TODO: use a different expiry calculation
  const hasExpired = (decodedToken.exp - (Date.now() / 1000)) < 0;
  if (hasExpired) {
    browserHistory.push('/login');
  } else {
    store.dispatch(loginSuccess(decodedToken));
  }
}

connectSocketToStore(socket, store);

window.store = store;
window.browserHistory = history;
window.socket = socket;
window.moment = moment;
window._ = _;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <DashboardRoutes history={history} />
    </Provider>,
    document.getElementById('root')
  );
});
