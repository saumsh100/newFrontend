
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { Patient, Family, PatientSearches, WaitSpot } from 'CareCruModels';
import { nodeField, nodeTypeMapper, AccountViewer } from './types';
import { patientType, patientMutation } from './patients';
import { familyType, familyMutation } from './families';
import { patientSearchesType, patientSearchesMutation } from './patientSearches';
import { waitSpotType, waitSpotMutation } from './waitSpots';
import { accountViewerType, accountViewerQuery } from './accountViewer';

/**
 * This is a important step on making relay works with our server.
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
  [PatientSearches.name]: patientSearchesType,
  [WaitSpot.name]: waitSpotType,

  // Other types should have the type and resolve function.
  [AccountViewer.name]: {
    type: accountViewerType,
    resolve: (globalId, context) => new AccountViewer(context.sessionData),
  },
});

/**
 * joining all queries that will be available to the user
 */
const rootQuery = Object.assign({}, accountViewerQuery, {
  node: nodeField,
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => rootQuery,
});

/**
 * joining all mutations that will be available to the user
 */
const rootMutation = Object.assign({},
  patientMutation,
  familyMutation,
  patientSearchesMutation,
  waitSpotMutation,
);

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
