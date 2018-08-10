
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';
import Login from './Login';
import Logged from './Logged';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import { hideButton } from '../../../../reducers/widgetNavigation';
import { setResetEmail } from '../../../../reducers/patientAuth';

class Logon extends PureComponent {
  componentDidMount() {
    this.props.setResetEmail(null);
    this.props.hideButton();
  }

  componentToRender({ isAuthenticated, isAccountTab, history }) {
    if (!isAuthenticated) {
      return <Login />;
    } else if (!isAccountTab) {
      return history.action !== 'POP' ? (
        <Redirect to="./account" />
      ) : (
        <Redirect to="./book/date-and-time" />
      );
    }
    return <Logged />;
  }

  render() {
    const { isAuthenticated, isAccountTab, history } = this.props;

    return this.componentToRender({ isAuthenticated, isAccountTab, history });
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setResetEmail,
      hideButton,
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
  hideButton: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isAccountTab: PropTypes.bool,
  setResetEmail: PropTypes.func.isRequired,
};

Logon.defaultProps = {
  isAccountTab: false,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logon));
