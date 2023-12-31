
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '../components/library';
import { removeAlert } from '../reducers/alerts';
import { setSelectedCallId } from '../actions/caller';
import styles from './styles.scss';

class AlertContainer extends Component {
  constructor(props) {
    super(props);
    this.callerId = this.callerId.bind(this);
  }

  callerId(id) {
    this.props.setSelectedCallId(id);
  }

  render() {
    const { alerts } = this.props;

    if (!alerts) {
      return null;
    }

    return (
      <div className={styles.alertsContainer}>
        {alerts.toArray().map((alert, index) => {
          const alertData = alert.toJS();
          const func = alertData.caller ? () => this.callerId(alertData.id) : () => null;

          return (
            <Alert
              key={`${index}_alert`}
              index={index}
              alert={alertData}
              alertClick={func}
              removeAlert={this.props.removeAlert}
            />
          );
        })}
      </div>
    );
  }
}

AlertContainer.propTypes = {
  alerts: PropTypes.object.isRequired,
  removeAlert: PropTypes.func.isRequired,
  setSelectedCallId: PropTypes.func.isRequired,
};

function mapStateToProps({ alerts }) {
  return { alerts };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      setSelectedCallId,
      removeAlert,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapActionsToProps,
);

export default enhance(AlertContainer);
