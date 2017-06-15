
import React, { Component, PropTypes } from 'react';
import PatientData from './PatientData';
import { List, Button, IconButton } from '../../library';
import styles from './styles.scss';

class AddPatientSuggestions extends Component {
  constructor(props) {
    super(props);
    this.handleCreatePatient = this.handleCreatePatient.bind(this);
  }

  handleCreatePatient() {
    const {
      setMergingPatient,
      mergingPatientData,
      reinitializeState,
    } = this.props;

    setMergingPatient({
      patientUser: mergingPatientData.patientUser,
      requestData: mergingPatientData.requestData,
      suggestions: [],
    });
  }
  render() {
    const {
      mergingPatientData,
      reinitializeState,
      selectAppointment
    } = this.props;

    const suggestions = mergingPatientData.suggestions;
    const patientUser = mergingPatientData.patientUser;
    const fullName = `${patientUser.firstName} ${patientUser.lastName}`;

    return (
      <div className={styles.suggestionsContainer}>
        <IconButton
          icon="times"
          onClick={reinitializeState}
          className={styles.trashIcon}
        />
        <div className={styles.title}>
          <span>Create Patient</span>
        </div>
        <div className={styles.patientSpeel}>
          We noticed the CareCru patient, {fullName}, did not have a patient record in your PMS. We have provided
          some possible matches to this patient. Please select one or create a new patient.
        </div>
        <List className={styles.suggestionsList}>
          {suggestions.map((patient) => {
            return (
              <PatientData
                key={patient.id}
                reinitializeState={reinitializeState}
                patient={patient}
                requestData={mergingPatientData.requestData}
                selectAppointment={selectAppointment}
              />
            );
          })}
        </List>
        <div className={styles.createPatientButtonContainer}>
          <Button onClick={this.handleCreatePatient}>
            Create New Patient
          </Button>
        </div>
      </div>
    );
  }
}

AddPatientSuggestions.propTypes = {
  mergingData: PropTypes.object.required,
};

export default AddPatientSuggestions;
