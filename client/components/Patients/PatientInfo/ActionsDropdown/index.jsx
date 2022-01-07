import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import ActionsDropdownMenu from './ActionsDropdownMenu';
import {
  setActivePatient,
  setIsNoteFormActive,
  setIsFollowUpsFormActive,
  setIsRecallsFormActive,
} from '../../../../reducers/patientTable';
import { getOrCreateChatForPatient } from '../../../../thunks/chat';
import { patientShape } from '../../../library/PropTypeShapes';

class PatientActionsDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggleForm = this.toggleForm.bind(this);
    this.handleGoToChat = this.handleGoToChat.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.patientChat === null && prevProps.patientChat !== this.props.patientChat) {
      this.props.push(`/chat/${this.props.patientChat}`);
    }
  }

  handleGoToChat(patientId) {
    return this.props.getOrCreateChatForPatient(patientId);
  }

  toggleForm(setFormActive) {
    const { patient } = this.props;
    this.props.setActivePatient(patient);
    setFormActive(true);
  }

  render() {
    const { canTextPatient, isSmsDisabled } = this.props;

    const actionMenuItems = [
      {
        key: 'add-note',
        children: <div>Add Note</div>,
        onClick: () => this.toggleForm(this.props.setIsNoteFormActive),
      },
      {
        key: 'add-follow-up',
        children: <div>Add Follow Up</div>,
        onClick: () => this.toggleForm(this.props.setIsFollowUpsFormActive),
      },
      {
        key: 'log-recall',
        children: <div>Log Recall</div>,
        onClick: () => this.toggleForm(this.props.setIsRecallsFormActive),
      },
      {
        key: 'go-to-chat',
        children: <div>Text Patient</div>,
        onClick: () => (canTextPatient ? this.handleGoToChat(this.props.patient.id) : {}),
        disabled: !canTextPatient,
        tooltipText: isSmsDisabled ? (
          <>
            This patient does not have a valid cellphone number.
            <br />
            Update their contact information to send them a text.
          </>
        ) : (
          <>
            This patient has no cellphone number.
            <br />
            Update their contact information to send them a text.
          </>
        ),
      },
      {
        key: 'go-patient-profile',
        children: <div>Patient Profile</div>,
        onClick: () => this.props.push(`/patients/${this.props.patient.id}`),
      },
    ];
    return <ActionsDropdownMenu actionMenuItems={actionMenuItems} {...this.props} />;
  }
}

PatientActionsDropdown.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  canTextPatient: PropTypes.bool,
  setActivePatient: PropTypes.func.isRequired,
  setIsNoteFormActive: PropTypes.func.isRequired,
  setIsFollowUpsFormActive: PropTypes.func.isRequired,
  setIsRecallsFormActive: PropTypes.func.isRequired,
  getOrCreateChatForPatient: PropTypes.func.isRequired,
  patientChat: PropTypes.string,
  push: PropTypes.func.isRequired,
  isSmsDisabled: PropTypes.bool,
};

PatientActionsDropdown.defaultProps = {
  canTextPatient: false,
  patientChat: '',
  isSmsDisabled: false,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActivePatient,
      setIsNoteFormActive,
      setIsFollowUpsFormActive,
      setIsRecallsFormActive,
      getOrCreateChatForPatient,
      push,
    },
    dispatch,
  );
}

function mapStateToProps({ chat }, { patient }) {
  let patientObj = patient;
  let canTextPatient;
  let isSmsDisabled;

  if (typeof patientObj.toJS === 'function') {
    patientObj = patient.toJS();
  }

  if (patientObj && patientObj.isSMSEnabled !== null && patientObj.isSMSEnabled !== undefined) {
    const { foundChatId, cellPhoneNumber, isSMSEnabled } = patientObj;
    canTextPatient = !!((foundChatId || cellPhoneNumber) && isSMSEnabled);
    isSmsDisabled = !isSMSEnabled;
  } else {
    isSmsDisabled = false;
    canTextPatient = !!(patientObj && (patientObj.foundChatId || patientObj.cellPhoneNumber));
  }
  return {
    canTextPatient,
    patientChat: chat.get('patientChat'),
    isSmsDisabled,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientActionsDropdown);
