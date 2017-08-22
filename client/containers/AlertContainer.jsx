
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
      alerts,
      hideAlert,
    } = this.props;

    if (!alerts) {
      return null;
    }

    return (
      <div className={styles.alertsContainer}>
        {alerts.toArray().map((alert, index) => {
          console.log(alert);
          const func = alert.caller ? () => this.callerId(alert.id) : this.handleAction;
          alert.body = <div onClick={func}>{alert.body}</div>;
          return (
            <Alert
              key={`${index}_alert`}
              index={index}
              alert={alert}
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
    alerts: alerts,
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
