
import { fetchQuery, graphql } from 'relay-runtime'; // eslint-disable-line import/no-extraneous-dependencies
import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query fetchPatientSearches_Query($where: SequelizeJSON!) {
    accountViewer {
      id
      accountId
      userId
      patientSearches(where: $where) {
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

export default async (context = 'topBar') => {
  const queryVariables = { where: { context } };
  const payload = await fetchQuery(graphQLEnvironment, query, queryVariables);
  return payload.accountViewer.patientSearches.edges.map(v => v.node.patient).filter(p => !!p);
};
