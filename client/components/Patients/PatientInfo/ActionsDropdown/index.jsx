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
import { isFeatureEnabledSelector } from '../../../../reducers/featureFlags';
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
    const { canAddNote, canAddFollowUp, canLogRecall, canTextPatient } = this.props;

    const actionMenuItems = [];
    canAddNote &&
      actionMenuItems.push({
        key: 'add-note',
        children: <div>Add Note</div>,
        onClick: () => this.toggleForm(this.props.setIsNoteFormActive),
      });

    canAddFollowUp &&
      actionMenuItems.push({
        key: 'add-follow-up',
        children: <div>Add Follow Up</div>,
        onClick: () => this.toggleForm(this.props.setIsFollowUpsFormActive),
      });

    canLogRecall &&
      actionMenuItems.push({
        key: 'log-recall',
        children: <div>Log Recall</div>,
        onClick: () => this.toggleForm(this.props.setIsRecallsFormActive),
      });

    canTextPatient &&
      actionMenuItems.push({
        key: 'go-to-chat',
        children: <div>Text Patient</div>,
        onClick: () => this.handleGoToChat(this.props.patient.id),
      });

    actionMenuItems.push({
      key: 'go-patient-profile',
      children: <div>Patient Profile</div>,
      onClick: () => this.props.push(`/patients/${this.props.patient.id}`),
    });

    return <ActionsDropdownMenu actionMenuItems={actionMenuItems} {...this.props} />;
  }
}

PatientActionsDropdown.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  canAddNote: PropTypes.bool,
  canAddFollowUp: PropTypes.bool,
  canLogRecall: PropTypes.bool,
  canTextPatient: PropTypes.bool,
  setActivePatient: PropTypes.func.isRequired,
  setIsNoteFormActive: PropTypes.func.isRequired,
  setIsFollowUpsFormActive: PropTypes.func.isRequired,
  setIsRecallsFormActive: PropTypes.func.isRequired,
  getOrCreateChatForPatient: PropTypes.func.isRequired,
  patientChat: PropTypes.string,
  push: PropTypes.func.isRequired,
};

PatientActionsDropdown.defaultProps = {
  canAddNote: false,
  canAddFollowUp: false,
  canLogRecall: false,
  canTextPatient: false,
  patientChat: '',
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

function mapStateToProps({ featureFlags, chat }, { patient }) {
  const features = featureFlags.get('flags');
  const canAddNote = isFeatureEnabledSelector(features, 'patient-add-note-action');
  const canAddFollowUp = isFeatureEnabledSelector(features, 'patient-add-follow-up-action');
  const canLogRecall = isFeatureEnabledSelector(features, 'patient-log-recall-action');
  const canTextPatient =
    patient &&
    (patient.foundChatId ||
      patient.cellPhoneNumber ||
      patient.homePhoneNumber ||
      patient.workPhoneNumber);

  return {
    canAddNote,
    canAddFollowUp,
    canLogRecall,
    canTextPatient,
    patientChat: chat.get('patientChat'),
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientActionsDropdown);
