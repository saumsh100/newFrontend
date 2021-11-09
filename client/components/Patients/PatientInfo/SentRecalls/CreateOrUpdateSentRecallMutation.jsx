import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';
import createManualSentRecall from '../../../GraphQL/SentRecalls/createManualSentRecall';
import updateManualSentRecall from '../../../GraphQL/SentRecalls/updateManualSentRecall';

export default function CreateOrUpdateSentRecallMutation(props) {
  return (
    <Mutation
      mutation={props.isUpdate ? updateManualSentRecall : createManualSentRecall}
      {...props}
    />
  );
}

CreateOrUpdateSentRecallMutation.propTypes = {
  isUpdate: PropTypes.bool.isRequired,
};
