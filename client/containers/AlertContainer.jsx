
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '../components/library';
import { hideAlert } from '../actions/alerts';
import { setSelectedCallId } from '../actions/caller';
import styles from './styles.scss';

class AlertContainer extends Component {

  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
    this.callerId = this.callerId.bind(this);
  }

  handleAction(alert) {
    alert.action();
  }

  callerId(id) {
    this.props.setSelectedCallId(id);
  }

  render() {
    const {
      alert,
      hideAlert,
    } = this.props;

    if (!alert) {
      return null;
    }

    const alertsStack = alert.toJS().alertsStack;

    return (
      <div className={styles.alertsContainer}>
        {alertsStack.map((alertData, index) => {
          console.log(alertData);
          const func = alertData.caller ? () => this.callerId(alertData.id) : this.handleAction;
          alertData.body = <div onClick={func}>{alertData.body}</div>;
          return (
            <Alert
              key={`${index}_alert`}
              index={index}
              alert={alertData}
              hideAlert={hideAlert}
              handleAction={this.handleAction}
            />
          );
        })}
      </div>
    );
  }
}

AlertContainer.propTypes = {
  alert: PropTypes.object.isRequired,
  hideAlert: PropTypes.func,
  setSelectedCallId: PropTypes.func,
};

function mapStateToProps({ alerts }) {
  return {
    alert: alerts,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    hideAlert,
    setSelectedCallId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(AlertContainer);
