import '../components/library/util/why-did-you-render';
import React from 'react';
import { render } from 'react-dom';
import { extendMoment } from 'moment-range';
import moment from 'moment-timezone';
import Immutable from 'immutable';
import nlp from 'compromise';
import connectSocketToStoreLogin from '../socket/connectSocketToStoreLogin';
import socket from '../socket';
import App from './Dashboard';
import configure from '../store';
import { browserHistory } from '../store/factory';
import { load } from '../thunks/auth';
import { loadUnreadMessages, loadUnreadChatCount } from '../thunks/chat';
import { loadOnlineRequest } from '../thunks/onlineRequests';
import { fetchWaitingRoomQueue } from '../thunks/waitingRoom';
import { initializeFeatureFlags } from '../thunks/featureFlags';
import DesktopNotification from '../util/desktopNotification';
import SubscriptionManager from '../util/graphqlSubscriptions';
import { identifyPracticeUser } from '../util/fullStory';
import { receiveEntities } from '../reducers/entities';
import ErrorBoundary from '../components/ErrorBoundary';

/* eslint-disable camelcase */
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
    const user = auth.get('user').toJS();
    const account = auth.get('account').toJS();
    const enterprise = auth.get('enterprise').toJS();
    const userId = user.id;
    const fullName = `${user.firstName} ${user.lastName}`;
    const email = user.username;
    const accountId = auth.get('accountId');

    if (process.env.NODE_ENV === 'production') {
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
      });
      DesktopNotification.requestPermission();
    }

    SubscriptionManager.accountId = accountId;
    const accounts = {
      [accountId]: auth.get('account').toJS(),
    };

    store.dispatch(
      receiveEntities({
        entities: { accounts },
      }),
    );

    store.dispatch(loadUnreadMessages());
    store.dispatch(loadUnreadChatCount());
    store.dispatch(loadOnlineRequest());
    store.dispatch(fetchWaitingRoomQueue({ accountId }));
    connectSocketToStoreLogin(store, socket);
  }
  // TODO: define globals with webpack ProvidePlugin
  window.store = store;
  window.socket = socket;
  window.moment = extendMoment(moment);
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
