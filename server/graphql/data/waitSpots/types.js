
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { Patient, PatientUser, WaitSpot } from 'CareCruModels';
import { patientType } from 'CareCruGraphQL/data/patients';
import { patientUserType } from 'CareCruGraphQL/data/patientUsers';
import { nodeInterface } from '../types';

const waitSpotType = new GraphQLObjectType({
  name: WaitSpot.name,
  description: 'Waitspot details',
  interfaces: [nodeInterface],
  isTypeOf: obj => obj instanceof WaitSpot,
  fields: () => ({
    ...attributeFields(WaitSpot, { globalId: true }),
    ccId: {
      type: GraphQLString,
      resolve: waitSpot => waitSpot.id,
    },
    // Queries for the Patient info for WaitSpot
    patient: {
      type: patientType,
      resolve: async patient => await Patient.findById(patient.patientId),
    },
    patientUser: {
      type: patientUserType,
      resolve: async patient => await PatientUser.findById(patient.patientUserId),
    },
  }),
});

const { connectionType: waitSpotConnection } = connectionDefinitions({
  connectionFields: {
    totalCount: {
      type: GraphQLInt,
      description: 'Total number of wait spots',
      resolve: connection => connection.totalCount,
    },
  },
  name: WaitSpot.name,
  nodeType: waitSpotType,
});

export { waitSpotType, waitSpotConnection };
