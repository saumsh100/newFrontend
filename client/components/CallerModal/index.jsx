
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DialogBox } from '../library';
import { unsetSelectedCallId } from '../../actions/caller';
import CallerDisplay from './CallerDisplay/';
import styles from './styles.scss';

class CallerModal extends Component {
  constructor(props) {
    super(props);
    this.clearSelectedChat = this.clearSelectedChat.bind(this);
  }

  clearSelectedChat() {
    this.props.unsetSelectedCallId();
  }

  render() {
    const {
      callerId,
      call,
      patient,
    } = this.props;

    const actions = !!callerId;

    return (
      <DialogBox
        title="Caller ID"
        type="small"
        active={actions}
        onEscKeyDown={this.clearSelectedChat}
        onOverlayClick={this.clearSelectedChat}
      >
        <CallerDisplay
          call={call}
          patient={patient}
        />
      </DialogBox>
    );
  }
}

CallerModal.propTypes = {
  callerId: PropTypes.string,
  call: PropTypes.object,
  patient: PropTypes.object,
  unsetSelectedCallId: PropTypes.func,
};

function mapStateToProps({ entities, caller }) {
  const callerId = caller.get('callerId');
  const calls = entities.getIn(['calls', 'models']);
  const patients = entities.getIn(['patients', 'models']);

  let call = null;
  let patient = null;

  if (callerId) {
    call = calls.get(callerId).toJS();
    if (call.patientId) {
      patient = patients.get(call.patientId).toJS();
    }
  }

  return {
    call,
    callerId,
    patient,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    unsetSelectedCallId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(CallerModal);
