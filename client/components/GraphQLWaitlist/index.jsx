
import Delete from './deleteWaitSpot';
import UpdateWaitSpot from './updateWaitSpot';
import MassDelete from './deleteMultipleWaitSpots';
import Fetch from './fetchWaitSpot';
import Create from './addWaitSpot';
import { subsQuery as AddWaitSpotSubscription } from './subscriptionAddWaitSpot';
import { subsQuery as RemoveWaitSpotSubscription } from './subscriptionRemoveWaitSpot';

export {
  Delete,
  MassDelete,
  Fetch,
  Create,
  UpdateWaitSpot,
  AddWaitSpotSubscription,
  RemoveWaitSpotSubscription,
};
