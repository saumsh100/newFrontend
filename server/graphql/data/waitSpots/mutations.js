
import { mutationWithClientMutationId } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { waitSpotType } from './types';
import { WaitSpot } from 'CareCruModels';
import PubSub from '../subscriptionsPubSub';
import { ADD_WAIT_SPOT } from '../channels';


const addWaitSpotMutation = mutationWithClientMutationId({
  name: 'addWaitSpot',
  inputFields: attributeFields(WaitSpot, {
    exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
  }),
  outputFields: {
    waitSpot: {
      type: waitSpotType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async (args) => {
    try {
      const newWaitSpot = await WaitSpot.create(args);
      PubSub.publish(ADD_WAIT_SPOT, { newWaitSpot });
      return newWaitSpot;
    } catch (e) {
      return null;
    }
  },
});

// /**
//  * Updates a patient for the provided id in the arguments object
//  * the other provided attributes will be used to update to model.
//  * Returns the updated patient model
//  */
// const updatePatientMutation = mutationWithClientMutationId({
//   name: 'updatePatient',
//   inputFields: attributeFields(Patient, {
//     exclude: ['status', 'createdAt', 'updatedAt', 'deletedAt'],
//   }),
//   outputFields: {
//     patient: {
//       type: patientType,
//       resolve: payload => payload,
//     },
//   },
//   mutateAndGetPayload: async ({ id, ...args }) =>
//     await Patient.findById(id).then(p => p.update(args)),
// });
//

const deleteWaitSpotMutation = mutationWithClientMutationId({
  name: 'deleteWaitSpot',
  inputFields: attributeFields(WaitSpot, {
    only: ['id'],
  }),
  outputFields: {
    waitSpot: {
      type: waitSpotType,
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async ({ id }) => await WaitSpot.findById(id).then(w => w.destroy()),
});

export default {
  addWaitSpotMutation,
  // updatePatientMutation,
  deleteWaitSpotMutation,
};
