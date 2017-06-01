
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import time from '../../server/util/time';
import socket from '../socket';
import App from './Dashboard';
import configure from '../store';
import { load } from '../thunks/auth';

LogRocket.init(process.env.LOGROCKET_APP_ID);

const browserHistory = createBrowserHistory();
const store = configure({ browserHistory });

// TODO: move to Auth service layer?
load()(store.dispatch);

const { auth } = store.getState();

if (auth.get('isAuthenticated')) {
  const token = auth.get('token').toJS();
  LogRocket.identify(token.userId, {
    name: `${token.firstName} ${token.lastName}`,
    email: token.username,
  });

  connectSocketToStoreLogin(store, socket);

}

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
  module.hot.accept('./Dashboard', () => render(App));
}
