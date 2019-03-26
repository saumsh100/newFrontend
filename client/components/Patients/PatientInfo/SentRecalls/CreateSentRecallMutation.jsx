
import React from 'react';
import { Mutation } from 'react-apollo';
import createManualSentRecall from '../../../GraphQL/SentRecalls/createManualSentRecall';

export default function CreateSentRecallMutation(props) {
  return <Mutation mutation={createManualSentRecall} {...props} />;
}
