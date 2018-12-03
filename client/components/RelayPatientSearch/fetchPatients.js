
import { fetchQuery, graphql } from 'relay-runtime'; // eslint-disable-line import/no-extraneous-dependencies
import graphQLEnvironment from '../../util/graphqlEnvironment';

const query = graphql`
  query fetchPatients_Query(
    $search: SequelizeJSON!
    $limit: Int
    $after: String
    $order: [[String]]
  ) {
    accountViewer {
      patients(where: $search, first: $limit, after: $after, order: $order) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
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
`;

const fetchPatients = async (props) => {
  const { search, limit = 15, after, order = ['firstName', 'lastName'] } = props;

  /**
   * split the search on space to look for first name and last name on the same search
   * e.g. the search "al b" will find Alejandrin Bradtke and Aliya Bayer
   */
  const splitSearch = search.split(' ').filter(v => v !== '');

  const whereClause = splitSearch[1]
    ? {
      $and: [
        { firstName: { $iLike: `${splitSearch[0]}%` } },
        { lastName: { $iLike: `${splitSearch[1]}%` } },
      ],
    }
    : {
      $or: [
        { firstName: { $iLike: `${splitSearch[0]}%` } },
        { lastName: { $iLike: `${splitSearch[0]}%` } },
        { email: { $iLike: `${search}%` } },
        { cellPhoneNumber: { $iLike: `${search}%` } },
      ],
    };

  const queryVariables = {
    search: JSON.stringify(whereClause),
    limit,
    after,
    order,
  };

  return fetchQuery(graphQLEnvironment, query, queryVariables);
};

export default fetchPatients;
