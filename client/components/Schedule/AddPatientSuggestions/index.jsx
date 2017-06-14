
import React, { Component, PropTypes } from 'react';
import PatientData from './PatientData';
import { List } from '../../library';
import styles from './styles.scss';

class AddPatientSuggestions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mergingData,
      reinitializeState,
      selectAppointment
    } = this.props;

    const suggestions = mergingData.suggestions;
    const patientUser = mergingData.patientUser;

    return (
      <div className={styles.suggestionsContainer}>
        <div className={styles.title}>
          <span>Create Patient</span>
        </div>
        <div className={styles.patientUser}>
          {patientUser.firstName}
        </div>
        <List className={styles.suggestionsList}>
          {suggestions.map((patient) => {
            return (
              <PatientData
                key={patient.id}
                reinitializeState={reinitializeState}
                patient={patient}
                requestData={mergingData.requestData}
                selectAppointment={selectAppointment}
              />
            );
          })}
        </List>
      </div>
    );
  }
}

AddPatientSuggestions.propTypes = {
  mergingPatientData: PropTypes.object.required,
};

export default AddPatientSuggestions;
