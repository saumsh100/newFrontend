
import React from 'react';
import { Mutation } from 'react-apollo';
import deletePatientFollowUp from '../../../GraphQL/PatientFollowUps/deletePatientFollowUp';

export default function DeletePatientFollowUpMutation(props) {
  return (
    <Mutation
      mutation={deletePatientFollowUp}
      refetchQueries={['fetchMyFollowUps_NEST']}
      {...props}
    />
  );
}
