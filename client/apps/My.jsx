
import React from 'react';
import { Provider } from 'react-redux';
import MyRoutes from '../routes/My';
import '../styles/default.scss';

const MyApp = ({ browserHistory, store }) =>
  <Provider store={store}>
    <MyRoutes history={browserHistory} />
  </Provider>;

export default MyApp;
