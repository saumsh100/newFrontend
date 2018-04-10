
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { Patient, Family } from 'CareCruModels';
import { familyType } from 'CareCruGraphQL/data/families';
import { nodeInterface } from '../types';

const patientType = new GraphQLObjectType({
  name: Patient.name,
  description: 'Details of a patient',
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof Patient,
  fields: () => ({
    ...attributeFields(Patient, { globalId: true }),
    ccId: {
      type: GraphQLString,
      resolve: patient => patient.id,
    },
    // Queries for the family of the patient
    family: {
      type: familyType,
      resolve: async patient => await Family.findById(patient.familyId),
    },
  }),
});

const { connectionType: patientConnection } = connectionDefinitions({
  name: Patient.name,
  nodeType: patientType,
});

export { patientType, patientConnection };
