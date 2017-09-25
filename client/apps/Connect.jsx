
import { Provider } from 'react-redux';
import React from 'react';
import ConnectRoutes from '../routes/Connect';
import '../styles/default.scss';

const ConnectApp = ({ browserHistory, store }) =>
  <Provider store={store}>
    <ConnectRoutes history={browserHistory} />
  </Provider>;

export default ConnectApp;
