import React from 'react';
import { Mutation } from '@apollo/client/react/components';
import deletePatientNote from '../../../GraphQL/PatientNotes/deletePatientNote';

export default function DeletePatientNoteMutation(props) {
  return <Mutation mutation={deletePatientNote} {...props} />;
}
