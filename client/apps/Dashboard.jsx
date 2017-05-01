
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jwt from 'jwt-decode';
import Immutable from 'immutable';

// TODO: improve this to only create socket when use is logged in, JWT is undefined when not...
import socket from '../socket';
import connectSocketToStore from '../socket/connectSocketToStore';
import DashboardRoutes from '../routes/Dashboard';
import configure from '../store';
import time from '../../server/util/time';
//import loadInitialData from '../../utilities/loadInitialData';
import { loginSuccess } from '../actions/auth';
import '../styles/dashboard.scss';

const store = configure({ browserHistory });
const history = syncHistoryWithStore(browserHistory, store);
// loadInitialData(store);

// TODO: below will call a flash with Login, perhaps fix with background color?
const token = localStorage.getItem('token');

const signUp = /^\/signup\/.+\/$/i;

const urlTest = signUp.test(window.location.pathname);

if (!token) {
  if (urlTest) {
    browserHistory.push(window.location.pathname);
  } else {
    browserHistory.push('/login');
  }
} else {
  const decodedToken = jwt(token);

  // TODO: use a different expiry calculation
  const hasExpired = (decodedToken.exp - (Date.now() / 1000)) < 0;
  if (hasExpired) {
    if (urlTest) {
      browserHistory.push(window.location.pathname);
    } else {
      browserHistory.push('/login');
    }
  } else {
    store.dispatch(loginSuccess(decodedToken));
    connectSocketToStore(socket, store);
  }
}


window.store = store;
window.browserHistory = history;
window.socket = socket;
window.moment = extendMoment(moment);
window.time = time;
window._ = _;
window.Immutable = Immutable;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <DashboardRoutes history={history} />
    </Provider>,
    document.getElementById('root')
  );
});
