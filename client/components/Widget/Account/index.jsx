
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

function Account({ patientUser, isAuthenticated, resetEmail, location, history }) {
  const parsedSearch = parse(location.search);

  if (isAuthenticated) {
    if (!patientUser.isPhoneNumberConfirmed) {
      return <SignUpConfirm />;
    }

    return <Redirect to="./book/patient-information" />;
  }

  if (parsedSearch.signUp) {
    return <SignUp />;
  }

  if (parsedSearch.reset && !resetEmail) {
    return <ResetPassword />;
  }

  if (!parsedSearch.signUp && resetEmail) {
    return <ResetSuccess />;
  }

  return history.goBack();
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
  resetEmail: PropTypes.string,
  patientUser: PropTypes.shape(patientUserShape),
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
};

Account.defaultProps = {
  resetEmail: null,
  patientUser: null,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Account),
);
