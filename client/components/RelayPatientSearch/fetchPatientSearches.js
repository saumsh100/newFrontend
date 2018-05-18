
import { fetchQuery, graphql } from 'relay-runtime'; // eslint-disable-line import/no-extraneous-dependencies
import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query fetchPatientSearches_Query {
    accountViewer {
      id
      accountId
      userId
      patientSearches {
        edges {
          node {
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
    }
  }
`;

export default async () => {
  const payload = await fetchQuery(graphQLEnvironment, query);
  return payload.accountViewer.patientSearches.edges.map(v => v.node.patient);
};
