
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { Modal } from '../library';
import { unsetSelectedCallId } from '../../actions/caller';
import CallerDisplay from './CallerDisplay';
import CallerDisplayUnknown from './CallerDisplayUnknown';
import { setScheduleDate } from '../../actions/schedule';
import { fetchEntitiesRequest, updateEntityRequest } from '../../thunks/fetchEntities';
import { patientShape } from '../library/PropTypeShapes';

class CallerModal extends PureComponent {
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
      updateEntityRequest: updateEntityRequestLocal,
      push: pushLocal,
      setScheduleDate: setScheduleDateLocal,
      patient: patientMap,
    } = this.props;

    const patient = patientMap?.toJS();

    let callDisplay = null;

    if (call) {
      if (patient) {
        callDisplay = (
          <CallerDisplay
            call={call}
            patient={patient}
            clearSelectedCall={this.clearSelectedCall}
            updateEntityRequest={updateEntityRequestLocal}
            push={pushLocal}
            setScheduleDate={setScheduleDateLocal}
          />
        );
      } else {
        callDisplay = (
          <CallerDisplayUnknown
            call={call}
            clearSelectedCall={this.clearSelectedCall}
            updateEntityRequest={updateEntityRequestLocal}
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
  callerId: PropTypes.string.isRequired,
  call: PropTypes.shape({}).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  unsetSelectedCallId: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  setScheduleDate: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, caller }) {
  const callerId = caller.get('callerId');
  const call = entities.getIn(['calls', 'models', callerId]);
  const patients = entities.getIn(['patients', 'models']);
  let patient = null;

  if (callerId && call.patientId) {
    patient = patients.get(call.patientId) || null;
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

export default connect(mapStateToProps, mapActionsToProps)(CallerModal);
