
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import { extendMoment } from 'moment-range';
import moment from 'moment-timezone';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import nlp from 'compromise';
import * as time from '@carecru/isomorphic';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import socket from '../socket';
import App from './Dashboard';
import configure from '../store';
import { load } from '../thunks/auth';
import { loadUnreadMessages } from '../thunks/chat';
import { loadOnlineRequest } from '../thunks/onlineRequests';
import { initializeFeatureFlags } from '../thunks/featureFlags';
import DesktopNotification from '../util/desktopNotification';
import SubscriptionManager from '../util/graphqlSubscriptions';
import { identifyPracticeUser } from '../util/fullStory';

if (process.env.NODE_ENV === 'production') {
  LogRocket.init(process.env.LOGROCKET_APP_ID);
  window.Intercom('boot', { app_id: process.env.INTERCOM_APP_ID });
}

const browserHistory = createBrowserHistory();
const store = configure({ browserHistory });

store.dispatch(
  initializeFeatureFlags({
    key: 'carecru',
    custom: { domain: window.location.hostname },
  }),
);

// TODO: move to Auth service layer?
load()(store.dispatch).then(() => {
  const { auth } = store.getState();
  if (auth.get('isAuthenticated')) {
    if (process.env.NODE_ENV === 'production') {
      const { account, enterprise, user } = auth.toJS();
      const userId = user.id;
      const fullName = `${user.firstName} ${user.lastName}`;
      const email = user.username;
      LogRocket.identify(userId, {
        name: fullName,
        email,
      });

      identifyPracticeUser({
        account,
        enterprise,
        user,
      });

      window.Intercom('update', {
        user_id: userId,
        name: fullName,
        email,
        created_at: user.createdAt,
        logrocketURL: `https://app.logrocket.com/${
          process.env.LOGROCKET_APP_ID
        }/sessions?u=${userId}`,
      });
    }

    SubscriptionManager.accountId = auth.get('accountId');
    store.dispatch(loadUnreadMessages());
    store.dispatch(loadOnlineRequest());
    DesktopNotification.requestPermission();
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
  window.nlp = nlp;

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
    module.hot.accept('./Dashboard', () => {
      const NextApp = require('./Dashboard').default; // eslint-disable-line global-require

      return render(NextApp);
    });
  }
});
