
import { graphql, commitMutation } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const mutation = graphql`
  mutation deleteMultipleWaitSpots_Mutation($input: deleteMultipleWaitSpotsInput!) {
    deleteMultipleWaitSpotsMutation(input: $input) {
      clientMutationId
    }
  }
`;

const commit = ids =>
  commitMutation(graphQLEnvironment, {
    mutation,
    variables: {
      input: { ids },
    },
  });

export default { commit };
