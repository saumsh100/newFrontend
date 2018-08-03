
import { GraphQLObjectType, GraphQLString } from 'graphql';
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray,
} from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { Patient, Family } from 'CareCruModels';
import { patientType, patientConnection } from 'CareCruGraphQL/data/patients';
import { nodeInterface } from '../types';

const familyType = new GraphQLObjectType({
  name: Family.name,
  description: 'Details of a family',
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof Family,
  fields: () => ({
    ...attributeFields(Family, { globalId: true }),
    ccId: {
      type: GraphQLString,
      resolve: family => family.id,
    },
    // Queries for the head of the family
    head: {
      type: patientType,
      resolve: async family =>
        Patient.findOne({ where: { id: family.headId } }),
    },
    // Queries for all members of this family
    members: {
      type: patientConnection,
      args: connectionArgs,
      resolve: (family, args) =>
        connectionFromPromisedArray(
          Patient.findAll({ where: { familyId: family.id } }),
          args,
        ),
    },
  }),
});

const { connectionType: familyConnection } = connectionDefinitions({
  name: Family.name,
  nodeType: familyType,
});

export { familyType, familyConnection };
