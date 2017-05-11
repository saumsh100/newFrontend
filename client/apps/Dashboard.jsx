import { createBrowserHistory } from 'history';
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
import DashboardRoutes from '../routes/DashboardNew';
import configure from '../store';
import time from '../../server/util/time';
import { load } from '../thunks/auth';
import '../styles/default.scss';

// import loadInitialData from '../../utilities/loadInitialData';
const browserHistory = createBrowserHistory();
// const history = syncHistoryWithStore(browserHistory, store);
// loadInitialData(store);

// TODO: below will call a flash with Login, perhaps fix with background color?

const store = configure({ browserHistory });

// Load auth from storage
load()(store.dispatch);

const { auth } = store.getState();

if (auth.get('isAuthenticated')) {
  connectSocketToStore(socket, store);
}

window.store = store;
window.browserHistory = browserHistory;
window.socket = socket;
window.moment = extendMoment(moment);
window.time = time;
window._ = _;
window.Immutable = Immutable;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <DashboardRoutes history={browserHistory} />
    </Provider>,
    document.getElementById('root')
  );
});
