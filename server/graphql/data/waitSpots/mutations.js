
import { GraphQLString, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { attributeFields } from 'graphql-sequelize';
import { waitSpotType } from './types';
import { WaitSpot } from 'CareCruModels';
import PubSub from '../subscriptionsPubSub';
import { ADD_WAIT_SPOT, REMOVE_WAIT_SPOT } from '../channels';


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
  mutateAndGetPayload: async ({ id }) => {
    try {
      const removeWaitSpot = await WaitSpot.findById(id);
      removeWaitSpot.destroy();
      PubSub.publish(REMOVE_WAIT_SPOT, { removeWaitSpot });
      return removeWaitSpot;
    } catch (e) {
      return null;
    }
  },
});

const deleteMultipleWaitSpotsMutation = mutationWithClientMutationId({
  name: 'deleteMultipleWaitSpots',
  inputFields: {
    ids: {
      type: GraphQLList(GraphQLString),
    },
  },
  outputFields: {
    waitSpots: {
      type: GraphQLList(waitSpotType),
      resolve: payload => payload,
    },
  },
  mutateAndGetPayload: async ({ ids }) => {
    try {
      const query = {
        where: { id: ids },
      };
      const listToRemove = await WaitSpot.findAll(query);
      await WaitSpot.destroy(query);

      listToRemove.forEach((removeWaitSpot) => {
        PubSub.publish(REMOVE_WAIT_SPOT, { removeWaitSpot });
      });

      return listToRemove;
    } catch (e) {
      return null;
    }
  },
});

export default {
  addWaitSpotMutation,
  deleteWaitSpotMutation,
  deleteMultipleWaitSpotsMutation,
};
