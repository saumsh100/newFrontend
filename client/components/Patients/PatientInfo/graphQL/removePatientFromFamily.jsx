import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import mutation from './removePatientFromFamily_Mutation';
import patientInfoQuery from '../PatientInfo_Query';

const removePatientFromFamily = ({ currentPatientId, ...props }) => (
  <Mutation
    mutation={mutation}
    {...props}
    refetchQueries={[
      {
        query: patientInfoQuery,
        variables: { patientId: currentPatientId },
      },
    ]}
  />
);

export default removePatientFromFamily;

removePatientFromFamily.propTypes = {
  currentPatientId: PropTypes.string.isRequired,
};
