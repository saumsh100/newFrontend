import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import mutation from './makePatientHeadOfFamily_Mutation';
import { showAlertTimeout } from '../../../../thunks/alerts';

const makePatientHeadOfFamily = ({ dispatch, ...props }) => (
  <Mutation
    mutation={mutation}
    {...props}
    onCompleted={() => {
      dispatch(
        showAlertTimeout({
          alert: {
            body: 'Updated head of family',
          },
          type: 'success',
        }),
      );
    }}
  />
);
export default makePatientHeadOfFamily;

makePatientHeadOfFamily.propTypes = {
  dispatch: PropTypes.func.isRequired,
};
