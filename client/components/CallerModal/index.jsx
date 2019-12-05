
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DialogBox, Modal, Icon } from '../library';
import { push } from 'connected-react-router';
import { unsetSelectedCallId } from '../../actions/caller';
import CallerDisplay from './CallerDisplay/';
import CallerDisplayUnknown from './CallerDisplayUnknown/';
import { setScheduleDate } from '../../actions/schedule';
import {
  fetchEntitiesRequest,
  updateEntityRequest,
} from '../../thunks/fetchEntities';
import styles from './styles.scss';

class CallerModal extends Component {
  constructor(props) {
    super(props);
    this.clearSelectedCall = this.clearSelectedCall.bind(this);
  }

  clearSelectedCall() {
    this.props.unsetSelectedCallId();
  }

  render() {
    const {
      callerId,
      call,
      patient,
      updateEntityRequest,
      push,
      setScheduleDate,
    } = this.props;

    let callDisplay = null;

    if (call) {
      if (patient) {
        callDisplay = (
          <CallerDisplay
            call={call}
            patient={patient}
            clearSelectedCall={this.clearSelectedCall}
            updateEntityRequest={updateEntityRequest}
            push={push}
            setScheduleDate={setScheduleDate}
          />
        );
      } else {
        callDisplay = (
          <CallerDisplayUnknown
            call={call}
            clearSelectedCall={this.clearSelectedCall}
            updateEntityRequest={updateEntityRequest}
          />
        );
      }
    }

    return (
      <Modal
        active={!!callerId || patient}
        onEscKeyDown={this.clearSelectedCall}
        onOverlayClick={this.clearSelectedCall}
        custom
      >
        {callDisplay}
      </Modal>
    );
  }
}

CallerModal.propTypes = {
  callerId: PropTypes.string,
  call: PropTypes.object,
  patient: PropTypes.object,
  unsetSelectedCallId: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  push: PropTypes.func,
  setScheduleDate: PropTypes.func,
};

function mapStateToProps({ entities, caller, apiRequests }) {
  const callerId = caller.get('callerId');
  const call = entities.getIn(['calls', 'models', callerId]);
  const patients = entities.getIn(['patients', 'models']);
  let patient = null;

  if (callerId && call.patientId) {
    patient = patients.get(call.patientId).toJS();
  }

  return {
    call,
    callerId,
    patient,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      unsetSelectedCallId,
      fetchEntitiesRequest,
      updateEntityRequest,
      push,
      setScheduleDate,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapActionsToProps,
);

export default enhance(CallerModal);
