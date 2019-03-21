
import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import createPatientNote from '../../../GraphQL/PatientNotes/createPatientNote';
import updatePatientNote from '../../../GraphQL/PatientNotes/updatePatientNote';

export default function CreateOrUpdatePatientNoteMutation(props) {
  return <Mutation mutation={props.isUpdate ? updatePatientNote : createPatientNote} {...props} />;
}

CreateOrUpdatePatientNoteMutation.propTypes = {
  isUpdate: PropTypes.bool.isRequired,
};
