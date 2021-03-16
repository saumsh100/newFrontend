
import React from 'react';
import { Mutation } from 'react-apollo';
import deletePatientNote from '../../../GraphQL/PatientNotes/deletePatientNote';

export default function DeletePatientNoteMutation(props) {
  return <Mutation mutation={deletePatientNote} {...props} />;
}
