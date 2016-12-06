
import React, { PropTypes } from 'react';
import { Table } from 'reactstrap';
import PatientListItem from './PatientListItem';

function PatientList({ patients, onChat }) {
  return (
    <Table>
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
    </Table>
  );
}

PatientList.propTypes = {
  patients: PropTypes.array.isRequired,
  onChat: PropTypes.func.isRequired,
};

export default PatientList;
