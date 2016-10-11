
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
// import './main.scss';

import Routes from '../Routes';
import configure from '../store';
//import loadInitialData from '../../utilities/loadInitialData';

const store = configure({ browserHistory });
const history = syncHistoryWithStore(browserHistory, store);
// loadInitialData(store);

window.store = store;
window.browserHistory = history;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>,
    document.getElementById('root')
  );
});
