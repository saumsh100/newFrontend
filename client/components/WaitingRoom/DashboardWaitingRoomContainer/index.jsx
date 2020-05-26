
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchWaitingRoomQueue,
  fetchWaitingRoomNotificationTemplate,
  sendWaitingRoomNotification,
  cleanWaitingRoomPatient,
  completeWaitingRoomPatient,
} from '../../../thunks/waitingRoom';
import WaitingRoomList from '../WaitingRoomList';

class DashboardWaitingRoomContainer extends Component {
  componentDidMount() {
    const { accountId } = this.props;
    this.props.fetchWaitingRoomNotificationTemplate({ accountId });
    this.props.fetchWaitingRoomQueue({ accountId });
  }

  render() {
    const { waitingRoomQueue, defaultTemplate } = this.props;
    if (!waitingRoomQueue) return null;
    return (
      <WaitingRoomList
        waitingRoomPatients={waitingRoomQueue}
        defaultTemplate={defaultTemplate}
        onNotify={this.props.sendWaitingRoomNotification}
        onClean={this.props.cleanWaitingRoomPatient}
        onComplete={this.props.completeWaitingRoomPatient}
      />
    );
  }
}

DashboardWaitingRoomContainer.propTypes = {
  waitingRoomQueue: PropTypes.shape({}),
  accountId: PropTypes.string.isRequired,
  defaultTemplate: PropTypes.string.isRequired,
  fetchWaitingRoomQueue: PropTypes.func.isRequired,
  fetchWaitingRoomNotificationTemplate: PropTypes.func.isRequired,
  sendWaitingRoomNotification: PropTypes.func.isRequired,
  cleanWaitingRoomPatient: PropTypes.func.isRequired,
  completeWaitingRoomPatient: PropTypes.func.isRequired,
};

DashboardWaitingRoomContainer.defaultProps = {
  waitingRoomQueue: null,
};

function mapStateToProps({ auth, waitingRoom }) {
  return {
    accountId: auth.get('accountId'),
    waitingRoomQueue: waitingRoom.get('waitingRoomQueue'),
    defaultTemplate: waitingRoom.get('defaultTemplate'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchWaitingRoomQueue,
      fetchWaitingRoomNotificationTemplate,
      sendWaitingRoomNotification,
      cleanWaitingRoomPatient,
      completeWaitingRoomPatient,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(DashboardWaitingRoomContainer);
