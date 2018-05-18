
import { graphql, commitMutation } from 'react-relay';
import graphQLEnvironment from '../../util/graphqlEnvironment';

const mutation = graphql`
  mutation addPatientSearch_Mutation($input: addPatientSearchesInput!) {
    addPatientSearchesMutation(input: $input) {
      patientSearch {
        patient {
          id
          ccId
          pmsId
          avatarUrl
          firstName
          lastName
          birthDate
          lastApptDate
        }
      }
    }
  }
`;

/**
 * Relay mutation wraped on a promise so when can use it on redux thunks
 * @param  input.patientId
 * @param  input.accountId
 * @param  input.userId
 * @param  input.clientMutationId
 */
const commit = input =>
  new Promise((resolve, reject) =>
    commitMutation(graphQLEnvironment, {
      mutation,
      variables: {
        input,
      },
      onCompleted: (payload, errors) => {
        if (errors) {
          reject(errors[0]);
          return;
        }

        resolve(payload.addPatientSearchesMutation.patientSearch.patient);
      },
      onError: (error) => {
        reject(error);
      },
    })
  );

export default { commit };
