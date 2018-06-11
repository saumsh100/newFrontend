
import {
  GraphQLObjectType,
} from 'graphql';
import { WaitSpot } from 'CareCruModels';
import { waitSpotType } from './types';


const testSubType = {
  name: "newSub",
  type: waitSpotType,
  description: 'Are you ready for the truth?',
  resolve(root, args, ctx, info) {
    return 1;
  },
};

export default {
  testSubType,
};
