
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface, AccountViewer } from '../types';
import { patientQuery } from '../patients';
import { familyQuery } from '../families';
import { patientSearchesQuery } from '../patientSearches';

// Filter the acountId based on the context sessionData
const accountIdFilter = {
  before: (findOptions, args, context) => {
    findOptions.where = Object.assign(
      { accountId: context.sessionData.accountId },
      findOptions.where
    );
    return findOptions;
  },
};

const accountViewerType = new GraphQLObjectType({
  name: AccountViewer.name,
  description: 'The account Viewer',
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof AccountViewer,
  fields: () => ({
    // Model/SessionData fields
    id: globalIdField(AccountViewer.name),
    userId: { type: GraphQLString },
    role: { type: GraphQLString },
    permissionId: { type: GraphQLString },
    enterpriseId: { type: GraphQLString },
    accountId: { type: GraphQLString },

    // Other exposed queries to this viewer
    ...patientQuery(accountIdFilter),
    ...familyQuery(accountIdFilter),
    ...patientSearchesQuery(accountIdFilter),
  }),
});

/**
 * Usually we're going to have multiple exports for each type
 * But this case we dont have any connection for this type
 */
// eslint-disable-next-line import/prefer-default-export
export { accountViewerType };
