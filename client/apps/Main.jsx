
//import { browserHistory } from 'react-router';
//import { syncHistoryWithStore } from 'react-router-redux';
//import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

//import Routes from '../../routes';
//import configure from '../../store';

//const store = configure({ browserHistory });
//const history = syncHistoryWithStore(browserHistory, store);
//loadInitialData(store);

// window.store = store;
//window.browserHistory = history;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <h1>
      CareCru DashBoard
    </h1>,
    document.getElementById('root')
  );
});
