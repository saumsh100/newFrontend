
import React from 'react';
import { Mutation } from 'react-apollo';
import createPatientNote from '../../../GraphQL/PatientNotes/createPatientNote';

export default function CreatePatientNoteMutation(props) {
  return <Mutation mutation={createPatientNote} {...props} />;
}
