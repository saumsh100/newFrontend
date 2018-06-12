
import PubSub from '../subscriptionsPubSub';
import { waitSpotType } from './types';
import { ADD_WAIT_SPOT } from '../channels';

const newWaitSpot = {
  name: 'newWaitSpot',
  type: waitSpotType,
  description: 'New wait spot created notification.',
  subscribe() {
    return PubSub.asyncIterator(ADD_WAIT_SPOT);
  },
};

export default {
  newWaitSpot,
};
