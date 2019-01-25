
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import * as time from '@carecru/isomorphic';
import App from './My';
import configure from '../store/myStore';
import { loadPatient } from '../thunks/patientAuth';
import bindAxiosInterceptors from '../util/bindAxiosInterceptors';
import { initializeFeatureFlags } from '../thunks/featureFlags';

// getToken function is custom
bindAxiosInterceptors(() => localStorage.getItem('auth_token'));

LogRocket.init(process.env.LOGROCKET_APP_ID);

const browserHistory = createBrowserHistory();
const store = configure({
  initialState: window.__INITIAL_STATE__, // eslint-disable-line no-underscore-dangle
  browserHistory,
});

// initialize feature flag client and get initial flags
store.dispatch(initializeFeatureFlags());

loadPatient()(store.dispatch).then(() => {
  const { auth } = store.getState();
  if (auth.get('isAuthenticated')) {
    const patientUser = auth.get('patientUser').toJS();
    LogRocket.identify(patientUser.id, {
      name: `${patientUser.firstName} ${patientUser.lastName}`,
      email: patientUser.email,
    });
  }

  console.log('loadPatient completed successfully');

  // TODO: define globals with webpack ProvidePlugin
  window.store = store;
  window.browserHistory = browserHistory;
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
