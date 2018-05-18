
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { resolver } from 'graphql-sequelize';
import { familyType } from './types';
import { Family } from 'CareCruModels';

const familyResolver = options => resolver(Family, options);

export default resolverOptions => ({
  families: {
    type: new GraphQLList(familyType),
    resolve: familyResolver(resolverOptions),
  },
  family: {
    type: familyType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLString),
      },
    },
    resolve: familyResolver(resolverOptions),
  },
});
