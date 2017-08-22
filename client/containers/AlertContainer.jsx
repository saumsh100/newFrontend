
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '../components/library';
import { removeAlert } from '../actions/alerts';
import styles from './styles.scss';

class AlertContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      alerts,
      removeAlert,
    } = this.props;

    if (!alerts) {
      return null;
    }

    return (
      <div className={styles.alertsContainer}>
        {alerts.toArray().map((alert, index) => {
          return (
            <Alert
              key={`${index}_alert`}
              index={index}
              alert={alert}
              removeAlert={removeAlert}
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
};

function mapStateToProps({ alerts }) {
  return {
    alerts: alerts,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    removeAlert,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(AlertContainer);
