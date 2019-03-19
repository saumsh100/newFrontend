
import React from 'react';
import { Mutation } from 'react-apollo';
import createPatientFollowUp from '../../../GraphQL/PatientFollowUps/createPatientFollowUp';

export default function CreateFollowUpMutation(props) {
  return <Mutation mutation={createPatientFollowUp} {...props} />;
}
