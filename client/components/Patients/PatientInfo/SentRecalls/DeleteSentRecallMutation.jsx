
import React from 'react';
import { Mutation } from 'react-apollo';
import deleteManualSentRecall from '../../../GraphQL/SentRecalls/deleteManualSentRecall';

export default function DeleteSentRecallMutation(props) {
  return <Mutation mutation={deleteManualSentRecall} {...props} />;
}
