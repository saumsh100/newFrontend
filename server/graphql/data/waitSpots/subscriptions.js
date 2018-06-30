
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import PubSub from '../subscriptionsPubSub';
import { waitSpotType } from './types';
import { ADD_WAIT_SPOT, REMOVE_WAIT_SPOT } from '../channels';

const newWaitSpot = {
  name: 'newWaitSpot',
  type: waitSpotType,
  args: {
    accountId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  description: 'New wait spot created notification.',
  subscribe: withFilter(
    () => PubSub.asyncIterator(ADD_WAIT_SPOT),
    (payload, variables) => payload.newWaitSpot.dataValues.accountId === variables.accountId,
  ),
};

const removeWaitSpot = {
  name: 'removeWaitSpot',
  type: waitSpotType,
  args: {
    accountId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  description: 'Wait spot removed.',
  subscribe: withFilter(
    () => PubSub.asyncIterator(REMOVE_WAIT_SPOT),
    (payload, variables) => payload.removeWaitSpot.dataValues.accountId === variables.accountId,
  ),
};

export default {
  newWaitSpot,
  removeWaitSpot,
};
