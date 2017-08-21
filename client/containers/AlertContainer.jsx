
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '../components/library';
import { hideAlert } from '../actions/alerts';
import styles from './styles.scss';

class AlertContainer extends Component {

  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction(alert) {
    alert.action();
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
};

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
