
import React, { PropTypes } from 'react';
import PatientListItem from './PatientListItem';

function PatientList({ patients, onChat }) {
  patients = patients.get('models').toArray();
  
  console.log(patients);
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone Number</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => {
          return (
            <PatientListItem
              key={patient.id}
              patient={patient}
              onChat={onChat}
            />
          );
        })}
      </tbody>
    </table>
  );
}

PatientList.propTypes = {
  patients: PropTypes.array.isRequired,
  onChat: PropTypes.func.isRequired,
};

export default PatientList;
