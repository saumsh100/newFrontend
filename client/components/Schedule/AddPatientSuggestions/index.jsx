
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PatientData from './PatientData';
import { List, Button, IconButton } from '../../library';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class AddPatientSuggestions extends Component {
  constructor(props) {
    super(props);
    this.handleCreatePatient = this.handleCreatePatient.bind(this);
    this.handleUpdatePatient = this.handleUpdatePatient.bind(this);
  }

  handleCreatePatient() {
    const {
      setMergingPatient,
      mergingPatientData,
    } = this.props;

    setMergingPatient({
      patientUser: mergingPatientData.patientUser,
      requestData: mergingPatientData.requestData,
      suggestions: [],
    });
  }

  handleUpdatePatient(appointment) {
    const {
      patients,
      reinitializeState,
      selectAppointment,
      mergingPatientData,
      updateEntityRequest,
    } = this.props;

    const patientModel = patients.get(appointment.patientId);
    const patientUserId = mergingPatientData.patientUser.id;
    const modifiedPatient = patientModel.set('patientUserId', patientUserId);

    const confirmSuggestion = confirm('Are you sure you want to connect these patients?');


    if (confirmSuggestion) {
      updateEntityRequest({
        key: 'patients',
        model: modifiedPatient,
        url: `/api/patients/${modifiedPatient.get('id')}`,
      })
        .then(() => {
          reinitializeState();
          return selectAppointment(appointment);
        });
    }
  }

  render() {
    const {
      mergingPatientData,
    } = this.props;

    const suggestions = mergingPatientData.suggestions;
    const patientUser = mergingPatientData.patientUser;
    const fullName = `${patientUser.firstName} ${patientUser.lastName}`;

    return (
      <div>
        <div className={styles.patientSpeel}>
          We noticed the CareCru patient, {fullName}, did not have a patient record in your PMS. We have provided
          some possible matches to this patient. Please select one or create a new patient.
        </div>
        <List className={styles.suggestionsList}>
          {suggestions.map((patient, index) => {
            return (
              <PatientData
                key={patient.id}
                patient={patient}
                requestData={mergingPatientData.requestData}
                handleUpdatePatient={this.handleUpdatePatient}
              />
            );
          })}
        </List>
        <div className={styles.createPatientButtonContainer}>
          <Button border="blue" onClick={this.handleCreatePatient}>
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


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
};

function mapStateToProps({ entities }) {
  const patients = entities.getIn(['patients', 'models']);

  return {
    patients,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddPatientSuggestions);
