
import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import createPatientFollowUp from '../../../GraphQL/PatientFollowUps/createPatientFollowUp';
import updatePatientFollowUp from '../../../GraphQL/PatientFollowUps/updatePatientFollowUp';

export default function CreateOrUpdateFollowUpMutation(props) {
  return (
    <Mutation
      mutation={props.isUpdate ? updatePatientFollowUp : createPatientFollowUp}
      {...props}
    />
  );
}

CreateOrUpdateFollowUpMutation.propTypes = {
  isUpdate: PropTypes.bool.isRequired,
};
