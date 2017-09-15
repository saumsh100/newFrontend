
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
import App from './Connect';
import configure from '../store/connectStore';
import connectSocketToConnectStore from '../socket/connectSocketToConnectStore';
import { load as loadUser } from '../thunks/auth';
import bindAxiosInterceptors from '../util/bindAxiosInterceptors';

// Bind the token setting in header
bindAxiosInterceptors();

const browserHistory = createBrowserHistory();
const store = configure({ initialState: window.__INITIAL_STATE__, browserHistory });

// Bind event handlers from parent
loadUser()(store.dispatch).then(() => {
  const { auth } = store.getState();
  if (auth.get('isAuthenticated')) {
    // hook up sockets to the connecter status update events
    connectSocketToConnectStore(store, socket);
  }

  // TODO: define globals with webpack ProvidePlugin
  window.store = store;
  window.browserHistory = browserHistory;
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

  render(App);

  if (module.hot) {
    module.hot.accept('./Connect', () => render(App));
  }
});




