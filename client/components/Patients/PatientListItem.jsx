

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RouterButton from '../library/RouterButton';
import Button from '../library/Button';
import { entityDelete } from '../../thunks/fetchEntities';

function PatientListItem({ patient, onChat, entityDelete }) {
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
          onClick={() => fetchDelete({ key: 'patients', id: patient.id })}>
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
    entityDelete,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(PatientListItem);
