
import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import App from './containers/App';

let counter = 0;
export default function Routes({ history }) {
  return (
    <Router history={history} key={counter}>
      <Route path="/" component={App}>
        <IndexRoute
          getComponent={(location, callback) => {
            require.ensure(['./components/Dashboard'], (require) => {
              callback(null, require('./components/Dashboard').default);
            });
          }}
        />
        <Route
          path="vendasta"
          getComponent={(location, callback) => {
            require.ensure(['./components/Vendasta'], (require) => {
              callback(null, require('./components/Vendasta').default);
            });
          }}
        />
        <Route
          path="account"
          getComponent={(location, callback) => {
            require.ensure(['./containers/AccountContainer'], (require) => {
              callback(null, require('./containers/AccountContainer').default);
            });
          }}
        />
      </Route>
    </Router>
  );
}

if (module.hot) {
  counter++;
  module.hot.accept();
}

Routes.propTypes = {
  history: PropTypes.object.isRequired,
};
