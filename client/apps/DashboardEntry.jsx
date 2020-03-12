
import React from 'react';
import { render } from 'react-dom';
import { extendMoment } from 'moment-range';
import moment from 'moment-timezone';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import nlp from 'compromise';
import * as time from '@carecru/isomorphic';
import './logrocketSetup';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import socket from '../socket';
import App from './Dashboard';
import configure from '../store';
import { browserHistory } from '../store/factory';
import { load } from '../thunks/auth';
import { loadUnreadMessages } from '../thunks/chat';
import { loadOnlineRequest } from '../thunks/onlineRequests';
import { initializeFeatureFlags } from '../thunks/featureFlags';
import DesktopNotification from '../util/desktopNotification';
import SubscriptionManager from '../util/graphqlSubscriptions';
import { identifyPracticeUser } from '../util/fullStory';
import { receiveEntities } from '../reducers/entities';
import ErrorBoundary from '../components/ErrorBoundary';

if (process.env.NODE_ENV === 'production') {
  window.Intercom('boot', { app_id: process.env.INTERCOM_APP_ID });
}

const store = configure();

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
    const { account, enterprise, user } = auth.toJS();
    const userId = user.id;
    const fullName = `${user.firstName} ${user.lastName}`;
    const email = user.username;

    if (process.env.NODE_ENV === 'production') {
      identifyPracticeUser({
        account,
        enterprise,
        user,
      });

      LogRocket.identify(userId, {
        app: 'CCRU_DASHBOARD',
        name: fullName,
        email,
        env: process.env.NODE_ENV,
      });

      window.Intercom('update', {
        user_id: userId,
        name: fullName,
        email,
        created_at: user.createdAt,
      });
      DesktopNotification.requestPermission();
    }

    SubscriptionManager.accountId = auth.get('accountId');
    store.dispatch(
      receiveEntities({
        entities: {
          accounts: {
            [auth.get('accountId')]: auth.get('account').toJS(),
          },
        },
      }),
    );

    store.dispatch(loadUnreadMessages());
    store.dispatch(loadOnlineRequest());
    connectSocketToStoreLogin(store, socket);
  }
  // TODO: define globals with webpack ProvidePlugin
  window.store = store;
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

  const renderApp = () =>
    render(
      <ErrorBoundary>
        <App {...appProps} />
      </ErrorBoundary>,
      document.getElementById('root'),
    );

  renderApp();

  if (module.hot) {
    module.hot.accept('./Dashboard', () => renderApp());
  }
});
