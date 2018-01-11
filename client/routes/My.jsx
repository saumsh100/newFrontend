
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import PatientPage from '../components/My/PatientPage';
import FourZeroFour from '../components/FourZeroFour';
import SignUp from '../components/SignUpInvite';
import ResetPassword from '../components/ForgotPassword/ResetPassword';
import ConfirmedAppointment from '../components/My/PatientPage/ConfirmedAppointment';
import getParameterByName from '../components/My/PatientPage/Shared/getParameterByName';
import Unsubscribe from '../components/My/PatientPage/Unsubscribe';
import withAuthProps from '../hocs/withAuthProps';

const MyRouter = ({ history }) => {
  // These routes are for the static patient-facing pages
  const PatientPages = (props) => {
    const params = getParameterByName('params');
    return (
      <PatientPage {...props} params={params}>
        <Switch>
          <Route
            exact
            path="/reset-password/:token"
            render={props => (
              <ResetPassword
                {...props}
                patientUser
              />
            )}
          />
          <Route
            exact
            path="/sentReminders/:sentReminderId/confirmed"
            render={props => (
              <ConfirmedAppointment
                {...props}
                params={params}
              />
            )}
          />
          <Route
            path="/unsubscribe"
            render={props => (
              <Unsubscribe
                {...props}
                params={params}
              />
            )}
          />
          <Route component={FourZeroFour}/>
        </Switch>
      </PatientPage>
    );
  };


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
