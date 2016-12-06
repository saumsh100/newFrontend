

import React, { PropTypes } from 'react';
import RouterButton from '../library/RouterButton';

function PatientListItem({ patient, onChat }) {
  return (
    <tr>
      <td>{patient.firstName}</td>
      <td>{patient.lastName}</td>
      <td>{patient.phoneNumber}</td>
      <td>
        <RouterButton to={`/patients/${patient.id}`}>
          Chat
        </RouterButton>
      </td>
    </tr>
  );
}

PatientListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  onChat: PropTypes.func.isRequired,
};

export default PatientListItem;
