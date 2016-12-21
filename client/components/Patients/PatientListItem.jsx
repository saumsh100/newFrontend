

import React, { PropTypes } from 'react';
import RouterButton from '../library/RouterButton';
import Button from '../library/Button';
import AddPatientForm from './AddPatientForm';
import { openForm } from '../../actions/patientForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deletePatient } from '../../thunks/fetchPatients';

function PatientListItem({ patient, onChat, openForm, deletePatient}) {
  return (
    <tr>
      <td>{patient.firstName}</td>
      <td>{patient.lastName}</td>
      <td>{patient.phoneNumber}</td>
      <td>
        <RouterButton to={`/patients/${patient.id}`}>
          Chat
        </RouterButton>
        <Button style={{marginLeft:10}} onClick={()=> openForm(patient)}>Edit patient</Button>
        <Button style={{marginLeft:10}} onClick={()=> deletePatient(patient)}>Delete patient</Button>
      </td>
    </tr>
  );
}

PatientListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  onChat: PropTypes.func.isRequired,
};



function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    openForm,
    deletePatient
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(PatientListItem);




//export default PatientListItem;
