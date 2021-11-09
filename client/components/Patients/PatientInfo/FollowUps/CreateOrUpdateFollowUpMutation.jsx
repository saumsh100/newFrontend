import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import createPatientFollowUp from '../../../GraphQL/PatientFollowUps/createPatientFollowUp';
import updatePatientFollowUp from '../../../GraphQL/PatientFollowUps/updatePatientFollowUp';

export default function CreateOrUpdateFollowUpMutation(props) {
  return (
    <Mutation
      mutation={props.isUpdate ? updatePatientFollowUp : createPatientFollowUp}
      refetchQueries={['fetchMyFollowUps_NEST']}
      {...props}
    />
  );
}

CreateOrUpdateFollowUpMutation.propTypes = {
  isUpdate: PropTypes.bool.isRequired,
};
