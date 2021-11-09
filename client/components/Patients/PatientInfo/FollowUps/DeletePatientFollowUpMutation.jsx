import React from 'react';
import { Mutation } from '@apollo/client/react/components';
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
