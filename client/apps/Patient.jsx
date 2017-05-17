
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as Immutable from 'immutable';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import socket from '../socket';
import PatientRoutes from '../routes/Patient';
import configure from '../store/availabilitiesStore';

const browserHistory = createBrowserHistory();
const store = configure({ initialState: window.__INITIAL_STATE__, browserHistory });

window.store = store;
window.browserHistory = browserHistory;
window.socket = socket;
window.moment = moment;
window._ = _;
window.Immutable = Immutable;

console.log('Patient App');
console.log('width', window.innerWidth);
console.log('height', window.innerHeight);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <PatientRoutes history={browserHistory} />
    </Provider>,
    document.getElementById('root')
  );
});
