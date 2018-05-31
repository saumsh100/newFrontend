
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { PatientUser, Family } from 'CareCruModels';
import { familyType } from 'CareCruGraphQL/data/families';
import { nodeInterface } from '../types';

const patientUserType = new GraphQLObjectType({
  name: PatientUser.name,
  description: 'Details of a patient user',
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof PatientUser,
  fields: () => ({
    ...attributeFields(PatientUser, { globalId: true }),
    ccId: {
      type: GraphQLString,
      resolve: patient => patient.id,
    },
    // Queries for the family of the patient
    family: {
      type: familyType,
      resolve: async patientUser => await Family.findById(patientUser.patientUserFamilyId),
    },
  }),
});

const { connectionType: patientUserConnection } = connectionDefinitions({
  name: PatientUser.name,
  nodeType: patientUserType,
});

export { patientUserType, patientUserConnection };
