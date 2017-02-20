
import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import PatientApp from './containers/PatientApp';
import FourZeroFour from './components/FourZeroFour';

let counter = 0;

function onError(error) {
  console.log('router error', error);
}

export default function Routes({ history }) {
  return (
    <Router
      history={history}
      key={counter}
      onError={onError}
    >
      <Route path="/" component={PatientApp}>
        <Route path="*" component={FourZeroFour} />
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
