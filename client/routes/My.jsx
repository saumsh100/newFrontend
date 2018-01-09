
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import PatientPage from '../components/My/PatientPage';
import FourZeroFour from '../components/FourZeroFour';
import SignUp from '../components/SignUpInvite';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import ConfirmedAppointment from '../components/ConfirmedAppointment';
import withAuthProps from '../hocs/withAuthProps';

const MyRouter = ({ history }) => {
  // These routes are for the static patient-facing pages
  const PatientPages = props =>
    <PatientPage {...props}>
      <Switch>
        <Route
          exact
          path="/reset-password/:token" render={(props) => (
            <ResetPassword
              {...props}
              patientUser
            />
          )}
        />
        <Route
          exact
          path="/sentReminders/:sentReminderId/confirmed" render={props => <ConfirmedAppointment {...props} />}
        />
        <Route path="/unsubscribe" component={SignUp} />
        <Route component={FourZeroFour} />
      </Switch>
    </PatientPage>;


  // We keep a main Router in case we change things down the Road
  return (
    <Router history={history}>
      <div>
        <Switch>
          {/* TODO: below are both tokenized links, need to handle properly */}
          <Route path="/" component={PatientPages} />
        </Switch>
      </div>
    </Router>
  );
};

MyRouter.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withAuthProps(MyRouter);
