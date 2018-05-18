
import { mutationWithClientMutationId } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { patientSearchesType } from './types';
import { PatientSearches } from 'CareCruModels';

/**
 * Adds a Recent Search based on arguments provided.
 * Returns the added PatientSearch model
 */
const addPatientSearchesMutation = mutationWithClientMutationId({
  name: 'addPatientSearches',
  inputFields: attributeFields(PatientSearches, {
    exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
  }),
  outputFields: {
    patientSearch: {
      type: patientSearchesType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async args => await PatientSearches.create(args),
});

export default {
  addPatientSearchesMutation,
};
