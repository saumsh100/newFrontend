
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { extendMoment } from 'moment-range';
import moment from 'moment-timezone';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import * as time from '@carecru/isomorphic';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import { socketInstance } from '../socket';
import App from './Hub';
import configure from '../store';
import { load } from '../thunks/auth';
import { logout } from '../thunks/hubAuth';
import { loadUnreadMessages } from '../thunks/chat';
import { loadOnlineRequest } from '../thunks/onlineRequests';
import { setToolbarPosition, expandContent, setLocale } from '../reducers/electron';
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
  REQUEST_HOST,
  RESPONSE_HOST,
} from '../constants';
import { electron, webFrame } from '../util/ipc';
import { setApiUrl } from '../util/hub';
import SubscriptionManager from '../util/graphqlSubscriptions';
import { initializeFeatureFlags } from '../thunks/featureFlags';
import { browserHistory } from '../store/factory';

electron.send(REQUEST_HOST);

electron.on(RESPONSE_HOST, (event, { url }) => {
  setApiUrl(url);
  socketInstance.reconnect();
});

electron.once(RESPONSE_HOST, (event, { locale }) => {
  const { socket } = socketInstance;

  window.Intercom('boot', {
    app_id: process.env.INTERCOM_APP_ID,
    hide_default_launcher: true,
  });

  const store = configure();

  store.dispatch(setLocale(locale));

  // initialize feature flag client and get initial flags
  store.dispatch(initializeFeatureFlags());

  electron.on(TOOLBAR_POSITION_CHANGE, (e, data) => {
    store.dispatch(setToolbarPosition(data));
    browserHistory.push('/');
  });

  electron.send(REQUEST_TOOLBAR_POSITION);

  electron.on(ZOOM_FACTOR_CHANGE, (e, data) => {
    webFrame.setZoomFactor(data);
  });

  electron.send(REQUEST_ZOOM_FACTOR, { window: 'toolbar' });

  electron.on(SHOW_CONTENT, () => {
    const location = store.getState().router.location.pathname;
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
      });

      SubscriptionManager.accountId = auth.get('accountId');
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

    // Contex menu
    const { remote } = window.require('electron');
    const { Menu } = remote;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Undo',
        role: 'undo',
      },
      {
        label: 'Redo',
        role: 'redo',
      },
      { type: 'separator' },
      {
        label: 'Cut',
        role: 'cut',
      },
      {
        label: 'Copy',
        role: 'copy',
      },
      {
        label: 'Paste',
        role: 'paste',
      },
      { type: 'separator' },
      {
        label: 'Select all',
        role: 'selectall',
      },
    ]);

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let element = e.target;
      while (element) {
        if (element.nodeName.match(/^(input|textarea)$/i) || element.isContentEditable) {
          contextMenu.popup(remote.getCurrentWindow());
          break;
        }
        element = element.parentNode;
      }
    });

    // TODO: define globals with webpack ProvidePlugin
    window.store = store;
    window.socket = socket;
    window.moment = extendMoment(moment);
    window.time = time;
    window._ = _;
    window.Immutable = Immutable;

    // We have to create global objects only once
    // And pass them to App on render
    const appProps = {
      browserHistory,
      store,
    };

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
        const NextApp = require('./Hub').default; // eslint-disable-line global-require
        return render(NextApp);
      });
    }
  });
});
