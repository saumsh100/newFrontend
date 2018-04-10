
import { mutationWithClientMutationId } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { patientType } from './types';
import { Patient } from 'CareCruModels';

/**
 * Adds a patient based on arguments provided.
 * Returns the added patient model
 */
const addPatientMutation = mutationWithClientMutationId({
  name: 'addPatient',
  inputFields: attributeFields(Patient, {
    exclude: ['id', 'status', 'createdAt', 'updatedAt', 'deletedAt'],
  }),
  outputFields: {
    patient: {
      type: patientType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async args =>
     await Patient.create(args),
});

/**
 * Updates a patient for the provided id in the arguments object
 * the other provided attributes will be used to update to model.
 * Returns the updated patient model
 */
const updatePatientMutation = mutationWithClientMutationId({
  name: 'updatePatient',
  inputFields: attributeFields(Patient, {
    exclude: ['status', 'createdAt', 'updatedAt', 'deletedAt'],
  }),
  outputFields: {
    patient: {
      type: patientType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async ({ id, ...args }) =>
    await Patient.findById(id).then(p => p.update(args)),
});

/**
 * Deletes a patient for the provided id in the arguments object
 * Returns null
 */
const deletePatientMutation = mutationWithClientMutationId({
  name: 'deletePatient',
  inputFields: attributeFields(Patient, {
    only: ['id'],
  }),
  outputFields: null,
  mutateAndGetPayload: async ({ id }) => await Patient.findById(id).then(p => p.destroy()),
});

export default {
  addPatientMutation,
  updatePatientMutation,
  deletePatientMutation,
};
