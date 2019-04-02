
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionsDropdownMenu from './ActionsDropdownMenu';
import {
  setActivePatient,
  setIsNoteFormActive,
  setIsFollowUpsFormActive,
  setIsRecallsFormActive,
} from '../../../../reducers/patientTable';
import { isFeatureEnabledSelector } from '../../../../reducers/featureFlags';

class PatientActionsDropdown extends Component {
  constructor(props) {
    super(props);

    this.toggleForm = this.toggleForm.bind(this);
  }

  toggleForm(setFormActive) {
    const { patient } = this.props;
    this.props.setActivePatient(patient);
    setFormActive(true);
  }

  render() {
    const { canAddNote, canAddFollowUp, canLogRecall } = this.props;

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
        children: <div>Add Follow-up</div>,
        onClick: () => this.toggleForm(this.props.setIsFollowUpsFormActive),
      });

    canLogRecall &&
      actionMenuItems.push({
        key: 'log-recall',
        children: <div>Log Recall</div>,
        onClick: () => this.toggleForm(this.props.setIsRecallsFormActive),
      });

    return <ActionsDropdownMenu actionMenuItems={actionMenuItems} {...this.props} />;
  }
}

PatientActionsDropdown.propTypes = {
  patient: PropTypes.shape({}).isRequired,
  canAddNote: PropTypes.bool,
  canAddFollowUp: PropTypes.bool,
  canLogRecall: PropTypes.bool,
  setActivePatient: PropTypes.func.isRequired,
  setIsNoteFormActive: PropTypes.func.isRequired,
  setIsFollowUpsFormActive: PropTypes.func.isRequired,
  setIsRecallsFormActive: PropTypes.func.isRequired,
};

PatientActionsDropdown.defaultProps = {
  canAddNote: false,
  canAddFollowUp: false,
  canLogRecall: false,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActivePatient,
      setIsNoteFormActive,
      setIsFollowUpsFormActive,
      setIsRecallsFormActive,
    },
    dispatch,
  );
}

function mapStateToProps({ featureFlags }) {
  const features = featureFlags.get('flags');
  const canAddNote = isFeatureEnabledSelector(features, 'patient-add-note-action');
  const canAddFollowUp = isFeatureEnabledSelector(features, 'patient-add-follow-up-action');
  const canLogRecall = isFeatureEnabledSelector(features, 'patient-log-recall-action');
  return {
    canAddNote,
    canAddFollowUp,
    canLogRecall,
  };
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(PatientActionsDropdown);
