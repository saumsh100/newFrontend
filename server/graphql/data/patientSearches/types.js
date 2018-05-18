
import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { PatientSearches, Patient } from 'CareCruModels';
import { patientType } from 'CareCruGraphQL/data/patients';
import { nodeInterface } from '../types';

const patientSearchesType = new GraphQLObjectType({
  name: PatientSearches.name,
  description: 'Patient recent search',
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof PatientSearches,
  fields: () => ({
    ...attributeFields(PatientSearches, {
      globalId: true,
      exclude: ['deletedAt'],
    }),
    ccId: {
      type: GraphQLString,
      resolve: patientSearch => patientSearch.id,
    },
    // Queries for the patient
    patient: {
      type: patientType,
      resolve: async patientSearch => await Patient.findById(patientSearch.patientId),
    },
  }),
});

const { connectionType: patientSearchesConnection } = connectionDefinitions({
  name: PatientSearches.name,
  nodeType: patientSearchesType,
});

export { patientSearchesType, patientSearchesConnection };
