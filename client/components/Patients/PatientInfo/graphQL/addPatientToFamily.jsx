import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import addPatientToFamily from './addPatientToFamily_Mutation';
import addFamilyWithMembers from './addFamilyWithMembers_Mutation';
import patientInfoQuery from '../PatientInfo_Query';

const addPatientToAFamilyOrCreateFamilyWithMembers = ({
  currentPatientId,
  hasFamily,
  ...props
}) => (
  <Mutation
    mutation={hasFamily ? addPatientToFamily : addFamilyWithMembers}
    {...props}
    refetchQueries={[
      {
        query: patientInfoQuery,
        variables: { patientId: currentPatientId },
      },
    ]}
  />
);

export default addPatientToAFamilyOrCreateFamilyWithMembers;

addPatientToAFamilyOrCreateFamilyWithMembers.propTypes = {
  currentPatientId: PropTypes.string.isRequired,
  hasFamily: PropTypes.bool.isRequired,
};
