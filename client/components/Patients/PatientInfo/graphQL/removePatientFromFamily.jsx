import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import mutation from './removePatientFromFamily_Mutation';
import patientInfoQuery from '../PatientInfo_Query';
import { showAlertTimeout } from '../../../../thunks/alerts';

const removePatientFromFamily = ({ currentPatientId, dispatch, ...props }) => (
  <Mutation
    mutation={mutation}
    {...props}
    refetchQueries={[
      {
        query: patientInfoQuery,
        variables: { patientId: currentPatientId },
      },
    ]}
    onCompleted={() => {
      dispatch(
        showAlertTimeout({
          alert: {
            body: 'Family member removed',
          },
          type: 'success',
        }),
      );
    }}
  />
);

export default removePatientFromFamily;

removePatientFromFamily.propTypes = {
  currentPatientId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
