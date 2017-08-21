
import React, { PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import PatientApp from '../containers/PatientApp';
import FourZeroFour from '../components/FourZeroFour';

const PatientRouter = ({ history }) => {
  return (
    <Router history={history}>
      <div>
        <Route component={PatientApp} />
      </div>
    </Router>
  );
};

PatientRouter.propTypes = {
  history: PropTypes.object.isRequired,
};

export default PatientRouter;
