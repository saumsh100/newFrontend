
import '../components/library/util/why-did-you-render';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import Immutable from 'immutable';
import * as time from '@carecru/isomorphic';
import App from './My';
import configure from '../store/myStore';
import { loadPatient } from '../thunks/patientAuth';
import { initializeFeatureFlags } from '../thunks/featureFlags';
import { browserHistory } from '../store/factory';

const store = configure({
  initialState: window.__INITIAL_STATE__, // eslint-disable-line no-underscore-dangle
});

// initialize feature flag client and get initial flags
store.dispatch(initializeFeatureFlags());

loadPatient()(store.dispatch).then(() => {
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
