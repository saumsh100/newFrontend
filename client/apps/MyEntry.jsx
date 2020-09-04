
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import LogRocket from 'logrocket';
import ls from '@livesession/sdk';
import Immutable from 'immutable';
import * as time from '@carecru/isomorphic';
import './logrocketSetup';
import App from './My';
import configure from '../store/myStore';
import { loadPatient } from '../thunks/patientAuth';
import { initializeFeatureFlags } from '../thunks/featureFlags';
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
store.dispatch(initializeFeatureFlags());

loadPatient()(store.dispatch).then(() => {
  const { auth, availabilities } = store.getState();
  const account = availabilities.get('account').toJS();
  if (process.env.NODE_ENV === 'production') {
    if (auth.get('isAuthenticated')) {
      const patientUser = auth.get('patientUser').toJS();
      LogRocket.identify(patientUser.id, {
        app: 'CCRU_MY',
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
    module.hot.accept('./My', () => {
      const NextApp = require('./My').default; // eslint-disable-line global-require

      return render(NextApp);
    });
  }
});
