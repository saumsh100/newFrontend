
import { graphql, commitMutation } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const mutation = graphql`
  mutation addWaitSpot_Mutation($input: addWaitSpotInput!) {
    addWaitSpotMutation(input: $input) {
      waitSpot {
        patientId
        unavailableDays
        availableTimes
        endDate
        daysOfTheWeek
        preferences
      }
    }
  }
`;

const commit = input =>
  commitMutation(graphQLEnvironment, {
    mutation,
    variables: { input },
  });

export default { commit };
