
import { Provider } from 'react-redux';
import React from 'react';
import HubRoutes from '../routes/Hub';
import '../styles/default.scss';

const HubApp = ({ browserHistory, store }) => (
  <Provider store={store}>
    <HubRoutes history={browserHistory} />
  </Provider>
);

export default HubApp;
