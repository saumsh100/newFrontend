
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createMemoryHistory } from 'history';
import { extendMoment } from 'moment-range';
import moment from 'moment-timezone';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import time from '../../server/util/time';
import socket from '../socket';
import App from './Hub';
import configure from '../store';
import { load } from '../thunks/auth';
import { logout } from '../thunks/hubAuth';
import { loadUnreadMessages } from '../thunks/chat';
import { loadOnlineRequest } from '../thunks/onlineRequests';
import { setToolbarPosition, expandContent } from '../reducers/electron';
import bindAxiosInterceptors from '../util/bindAxiosInterceptors';
import DesktopNotification from '../util/desktopNotification';
import {
  TOOLBAR_POSITION_CHANGE,
  SHOW_TOOLBAR,
  LOGOUT_REQUEST,
  SHOW_CONTENT,
  REQUEST_USER_DATA,
  SET_USER_DATA,
  REQUEST_TOOLBAR_POSITION,
  ZOOM_FACTOR_CHANGE,
  REQUEST_ZOOM_FACTOR,
} from '../constants';
import { electron, webFrame } from '../util/ipc';

// Binds the token setting in header
bindAxiosInterceptors();

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(process.env.LOGROCKET_APP_ID);
}

window.Intercom('boot', {
  app_id: process.env.INTERCOM_APP_ID,
  hide_default_launcher: true,
});

const browserHistory = createMemoryHistory();
const store = configure({ browserHistory });

electron.on(TOOLBAR_POSITION_CHANGE, (e, data) => {
  store.dispatch(setToolbarPosition(data));
});

electron.send(REQUEST_TOOLBAR_POSITION);

electron.on(ZOOM_FACTOR_CHANGE, (e, data) => {
  webFrame.setZoomFactor(data);
});

electron.send(REQUEST_ZOOM_FACTOR, { window: 'toolbar' });

electron.on(SHOW_CONTENT, () => {
  const location = store.getState().routing.location.pathname;
  if (location.indexOf('/intercom') > -1) {
    return;
  }
  store.dispatch(expandContent());
});

// TODO: move to Auth service layer?
load()(store.dispatch).then(() => {
  const { auth } = store.getState();
  if (auth.get('isAuthenticated')) {
    const user = auth.get('user').toJS();
    const fullName = `${user.firstName} ${user.lastName}`;
    const userId = user.id;
    const email = user.username;

    if (process.env.NODE_ENV === 'production') {
      LogRocket.identify(userId, {
        name: fullName,
        email,
      });
    }

    window.Intercom('update', {
      user_id: userId,
      name: fullName,
      email,
      created_at: user.createdAt,
      logrocketURL: `https://app.logrocket.com/${
        process.env.LOGROCKET_APP_ID
      }/sessions?u=${userId}`,
    });

    store.dispatch(loadUnreadMessages());
    store.dispatch(loadOnlineRequest());
    DesktopNotification.requestPermission();
    connectSocketToStoreLogin(store, socket);

    electron.send(SHOW_TOOLBAR, {
      location: window.location.href,
      isAuth: true,
    });

    electron.on(REQUEST_USER_DATA, () => {
      electron.send(SET_USER_DATA, {
        user,
        role: auth.get('role'),
      });
    });

    electron.on(LOGOUT_REQUEST, () => {
      store.dispatch(logout());
    });
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
      document.getElementById('root'),
    );
  };

  render(App);

  if (module.hot) {
    module.hot.accept('./Hub', () => {
      const NextApp = require("./Hub").default; // eslint-disable-line
      return render(NextApp);
    });
  }
});
