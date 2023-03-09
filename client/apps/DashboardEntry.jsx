import '../components/library/util/why-did-you-render';
import React from 'react';
import { render } from 'react-dom';
import { extendMoment } from 'moment-range';
import moment from 'moment-timezone';
import Immutable from 'immutable';
import nlp from 'compromise';
import { ErrorBoundary } from 'react-error-boundary';
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
import ErrorPage from '../components/ErrorPage';
import zendesk from '../../public/scripts/zendesk';
import loadCancelations from '../thunks/cancelations';

/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
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
    const role = auth.get('role');
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

      const handleIntercomCheck = setInterval(() => {
        if (window.Intercom && typeof window.Intercom === 'function') {
          window.Intercom('boot', { app_id: process.env.INTERCOM_APP_ID });
          window.Intercom('update', {
            user_id: userId,
            name: fullName,
            email,
            created_at: user.createdAt,
            accountId,
            enterpriseName: enterprise.name,
            country: account.address.country,
            timezone: account.timezone,
            role,
            externalId: account.externalId || '',
          });
          clearInterval(handleIntercomCheck);
        }
      }, 1000);

      // Initialize zendesk support chat with User information
      zendesk().then(() => {
        const handleZendeskCheck = setInterval(() => {
          if (window.zE && typeof window.zE === 'function') {
            window.zE(() => {
              window.zE.identify({
                name: `${user.firstName} ${user.lastName}`,
                email: user.username,
                organization: enterprise.name,
              });
            });
            clearInterval(handleZendeskCheck);
          }
        }, 1000);
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
    store.dispatch(loadCancelations(accountId));
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
      <ErrorBoundary FallbackComponent={ErrorPage} onError={(e) => console.log(e)}>
        <App {...appProps} />
      </ErrorBoundary>,
      document.getElementById('root'),
    );

  renderApp();

  if (module.hot) {
    module.hot.accept('./Dashboard', () => renderApp());
  }
});
