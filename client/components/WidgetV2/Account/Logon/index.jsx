
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';
import Login from './Login';
import Logged from './Logged';
import { setResetEmail } from '../../../../actions/auth';
import { locationShape } from '../../../library/PropTypeShapes/routerShapes';

function Logon({
  isAuthenticated, location, history, isAccountTab, ...props
}) {
  const componentToRender = () => {
    if (!isAuthenticated) {
      return <Login />;
    } else if (!isAccountTab) {
      if (history.action !== 'POP') {
        return <Redirect to="./account" />;
      }
      return <Redirect to="./book/date-and-time" />;
    }
    return <Logged />;
  };
  props.setResetEmail(null);

  return componentToRender();
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setResetEmail,
    },
    dispatch,
  );
}
function mapStateToProps({ auth }) {
  return {
    patientUser: auth.get('patientUser'),
    isAuthenticated: auth.get('isAuthenticated'),
  };
}

Logon.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  isAccountTab: PropTypes.bool,
};

Logon.defaultProps = {
  isAccountTab: false,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logon));
