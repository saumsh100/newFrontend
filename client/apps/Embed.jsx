
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

import socket from '../socket';
import connectSocketToEmbedStore from '../socket/connectSocketToEmbedStore';
import configure from '../store/embed';
//import loadInitialData from '../../utilities/loadInitialData';
import Embed from '../components/Embed';

const store = configure({});
// loadInitialData(store);

connectSocketToEmbedStore(socket, store);

window.store = store;
window.socket = socket;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Embed />
    </Provider>,
    document.getElementById('root')
  );
});
