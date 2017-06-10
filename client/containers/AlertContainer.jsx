
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '../components/library';
import { hideAlert } from '../actions/alerts';

class AlertContainer extends Component {
  render() {
    const {
      alert,
      hideAlert
    } = this.props;

    return (
      <Alert
        alert={alert}
        hideAlert={hideAlert}
      />
    );
  }
}

// TODO: propTypes!

function mapStateToProps({ alerts }) {
  return {
    alert: alerts,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    hideAlert,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(AlertContainer);
