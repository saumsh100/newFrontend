
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { nodeField, nodeTypeMapper, AccountViewer } from './types';
import { Patient, Family } from 'CareCruModels';
import { patientType, patientMutation } from './patients';
import { familyType, familyMutation } from './families';
import { accountViewerType, accountViewerQuery } from './accountViewer';

/**
 * This is a importante step on making relay works with our server.
 * We need to map each type name to actual type object and also how to resolve it
 * so the Node type can resolve to any other type.
 * This is a mechanism so it can refetch specific objects in case of a change.
 *
 * nodeTypeMapper from graphql-sequelize does the heavy lifting here.
 * Type names will be the class names from sequelize.
 * To follow this convetion all other types must have its classes.
 *
 * All types need to be mapped not only the sequelized resolved.
 */
nodeTypeMapper.mapTypes({
  // All all sequelize types must follow this pattern.
  [Patient.name]: patientType,
  [Family.name]: familyType,

  // Other types should have the type and resolve function.
  [AccountViewer.name]: {
    type: accountViewerType,
    resolve: (globalId, context) => new AccountViewer(context.sessionData),
  },
});

const rootQuery = Object.assign({},
  accountViewerQuery,
  {
    node: nodeField,
  },
);

const rootMutation = Object.assign({}, patientMutation, familyMutation);

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => rootQuery,
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => rootMutation,
});

/**
 * This is the root endpoint of our serve.
 * Anything exposed needs to be inside this 2 objects.
 */
export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
