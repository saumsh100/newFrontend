
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';
import { parse } from 'query-string';
import { patientUserShape } from '../../library/PropTypeShapes';
import { locationShape, historyShape } from '../../library/PropTypeShapes/routerShapes';
import SignUp from './SignUp';
import SignUpConfirm from './SignUp/Confirm';
import ResetPassword from './ResetPassword';
import ResetSuccess from './ResetPassword/Success';

function Account({
  patientUser, isAuthenticated, resetEmail, location, history,
}) {
  const parsedSearch = parse(location.search);
  return (
    <div>
      {!isAuthenticated &&
        parsedSearch.signUp && (
          <div>
            <SignUp />
          </div>
        )}
      {isAuthenticated &&
        !patientUser.isPhoneNumberConfirmed && (
          <div>
            <SignUpConfirm />
          </div>
        )}
      {!isAuthenticated &&
        parsedSearch.reset &&
        !resetEmail && (
          <div>
            <ResetPassword />
          </div>
        )}
      {!isAuthenticated &&
        !parsedSearch.signUp &&
        resetEmail && (
          <div>
            <ResetSuccess />
          </div>
        )}
      {isAuthenticated &&
        patientUser.isPhoneNumberConfirmed &&
        !location.state.isAccountTab && <Redirect to="./book/patient-information" />}

      {isAuthenticated &&
        patientUser.isPhoneNumberConfirmed &&
        location.state.isAccountTab &&
        history.goBack()}
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}
function mapStateToProps({ auth }) {
  return {
    patientUser: auth.get('patientUser'),
    resetEmail: auth.get('resetEmail'),
    isAuthenticated: auth.get('isAuthenticated'),
  };
}

Account.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  resetEmail: PropTypes.string.isRequired,
  patientUser: PropTypes.shape(patientUserShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account));
