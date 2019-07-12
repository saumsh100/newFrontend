
import { graphQLServerUrl } from '../config/globals';
import httpClient from './httpClient';

/**
 * GraphQL Client for the server side
 * Work by querying a graphQL server URL set on the GRAPHQL_SERVER_URL environment variable.
 * Data should be an object with query attribute at least. If variables are needed for the query
 * they should be passed through the variables attribute of the same object.
 * @example
 * graphQLClient({
    query: `
      query {
        users {
          id
          username
          enterpriseId
          firstName
        }
      }
      `,
  })
 * @param data
 * @return {*}
 */
export default data =>
  httpClient({
    url: graphQLServerUrl,
    method: 'post',
    data,
  });
