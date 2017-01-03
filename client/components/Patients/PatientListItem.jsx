

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RouterButton from '../library/RouterButton';
import Button from '../library/Button';
import { openForm } from '../../actions/patientForm';
import { fetchDelete } from '../../thunks/fetchEntities';

function PatientListItem({ patient, onChat, openForm, fetchDelete }) {
  return (
    <tr>
      <td>{patient.firstName}</td>
      <td>{patient.lastName}</td>
      <td>{patient.phoneNumber}</td>
      <td>
        <RouterButton to={`/patients/${patient.id}`}>
          Chat
        </RouterButton>
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => openForm(patient)}
        >
          Edit patient
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => fetchDelete({ key: 'patients', id: patient.id })}
        >
          Delete patient
        </Button>
      </td>
    </tr>
  );
}

PatientListItem.propTypes = {
  onChat: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    openForm,
    fetchDelete,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(PatientListItem);
