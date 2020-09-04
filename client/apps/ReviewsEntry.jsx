
import React from 'react';
import { render } from 'react-dom';
import { push } from 'connected-react-router';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import LogRocket from 'logrocket';
import ls from '@livesession/sdk';
import Immutable from 'immutable';
import * as time from '@carecru/isomorphic';
import './logrocketSetup';
import App from './Reviews';
import configure from '../store/reviewsStore';
import connectStoreToHost from '../widget/connectStoreToHost';
import { loadPatient } from '../thunks/patientAuth';
import { initializeFeatureFlags } from '../thunks/featureFlags';
import { setOnlineBookingUserVars } from '../util/fullStory';
import ErrorBoundary from '../components/ErrorBoundary';
import { browserHistory } from '../store/factory';
import identifyLiveSession from '../util/LiveSession/identifyLiveSession';

if (process.env.EXECUTION_ENVIRONMENT === 'PRODUCTION') {
  ls.init(process.env.LIVESESSION_ID);
  ls.newPageView();
}

const store = configure({
  initialState: window.__INITIAL_STATE__, // eslint-disable-line no-underscore-dangle
});

// initialize feature flag client and get initial flags
// Booking widget needs the account on init
store.dispatch(
  initializeFeatureFlags({
    key: 'carecru',
    custom: {
      accountId: store
        .getState()
        .availabilities.get('account')
        .get('id'),
    },
  }),
);

// Bind event handlers from parent
connectStoreToHost(store);

loadPatient()(store.dispatch).then(() => {
  const { auth, availabilities } = store.getState();
  const account = availabilities.get('account').toJS();

  if (process.env.NODE_ENV === 'production') {
    setOnlineBookingUserVars({ account });
    if (auth.get('isAuthenticated')) {
      const patientUser = auth.get('patientUser').toJS();

      LogRocket.identify(patientUser.id, {
        app: 'CCRU_BOOKING',
        name: `${patientUser.firstName} ${patientUser.lastName}`,
        email: patientUser.email,
        env: process.env.NODE_ENV,
      });

      if (process.env.EXECUTION_ENVIRONMENT === 'PRODUCTION') {
        identifyLiveSession({
          account,
          patientUser,
        });
      }
    }
  }

  console.log('loadPatient completed successfully');

  // TODO: define globals with webpack ProvidePlugin
  window.store = store;
  window.push = push;
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
  const renderApp = () =>
    render(
      <ErrorBoundary>
        <App {...appProps} />
      </ErrorBoundary>,
      document.getElementById('root'),
    );

  renderApp();

  if (module.hot) {
    module.hot.accept('./Reviews', () => renderApp());
  }
});
