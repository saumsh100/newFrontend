
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DialogBox, Modal, Icon  } from '../library';
import { push } from 'react-router-redux';
import { unsetSelectedCallId } from '../../actions/caller';
import CallerDisplay from './CallerDisplay/';
import CallerDisplayUnknown from './CallerDisplayUnknown/';
import { setScheduleDate } from '../../actions/schedule';
import { fetchEntitiesRequest, updateEntityRequest } from '../../thunks/fetchEntities';
import styles from './styles.scss';

class CallerModal extends Component {
  constructor(props) {
    super(props);
    this.clearSelectedChat = this.clearSelectedChat.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      patient,
    } = this.props;

    if (nextProps.patient && (!patient || (nextProps.patient.id !== this.props.patient.id))) {
      this.props.fetchEntitiesRequest({
        id: 'patientIdStats',
        url: `/api/patients/${nextProps.patient.id}/stats`,
      });
    }
  }

  clearSelectedChat() {
    this.props.unsetSelectedCallId();
  }

  render() {
    const {
      callerId,
      call,
      patient,
      patientIdStats,
      updateEntityRequest,
      push,
      setScheduleDate,
    } = this.props;


    let callDisplay = null;

    if (call) {
       if (patient) {
         callDisplay = (<CallerDisplay
           call={call}
           patient={patient}
           patientIdStats={patientIdStats}
           clearSelectedChat={this.clearSelectedChat}
           updateEntityRequest={updateEntityRequest}
           push={push}
           setScheduleDate={setScheduleDate}
         />)
       } else {
         callDisplay = (<CallerDisplayUnknown
           call={call}
           clearSelectedChat={this.clearSelectedChat}
           updateEntityRequest={updateEntityRequest}
         />)
       }
    }

    return (
      <Modal
        active={!!callerId}
        onEscKeyDown={this.clearSelectedChat}
        onOverlayClick={this.clearSelectedChat}
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

  const patientIdStats = (apiRequests.get('patientIdStats') ? apiRequests.get('patientIdStats').data : null);

  return {
    call,
    callerId,
    patient,
    patientIdStats,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    unsetSelectedCallId,
    fetchEntitiesRequest,
    updateEntityRequest,
    push,
    setScheduleDate,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(CallerModal);
