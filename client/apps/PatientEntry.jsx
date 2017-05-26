
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import Immutable from 'immutable';
import time from '../../server/util/time';
import socket from '../socket';
import App from './Patient';
import configure from '../store/availabilitiesStore';
import { load } from '../thunks/auth';
import connectSocketToStore from '../socket/connectSocketToStore';

const browserHistory = createBrowserHistory();
const store = configure({ initialState: window.__INITIAL_STATE__, browserHistory });

/*
// TODO: move to Auth service layer?
load()(store.dispatch);

const { auth } = store.getState();

if (auth.get('isAuthenticated')) {
  connectSocketToStore(socket, store);
}*/

// TODO: define globals with webpack ProvidePlugin
window.store = store;
window.browserHistory = browserHistory;
window.socket = socket;
window.moment = extendMoment(moment);
window.time = time;
window._ = _;
window.Immutable = Immutable;

// We have to create global objects only once
// And pass them to App on render
const appProps = { browserHistory, store };

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component {...appProps} />
    </AppContainer>,
    document.getElementById('root')
  );
};

document.addEventListener('DOMContentLoaded', () => render(App));

if (module.hot) {
  module.hot.accept('./Patient', () => render(App));
}
