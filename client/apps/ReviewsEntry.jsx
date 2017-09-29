
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import { push } from 'react-router-redux';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import LogRocket from 'logrocket';
import Immutable from 'immutable';
import time from '../../server/util/time';
import App from './Reviews';
import configure from '../store/reviewsStore';
import connectStoreToHost from '../widget/connectStoreToHost';
import { loadPatient } from '../thunks/patientAuth';
import bindAxiosInterceptors from '../util/bindAxiosInterceptors';

// getToken function is custom
bindAxiosInterceptors(() => localStorage.getItem('auth_token'));

LogRocket.init(process.env.LOGROCKET_APP_ID);

const browserHistory = createBrowserHistory();
const store = configure({ initialState: window.__INITIAL_STATE__, browserHistory });

// Bind event handlers from parent
connectStoreToHost(store);

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
  window.push = push;
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
    module.hot.accept('./Reviews', () => render(App));
  }
});




