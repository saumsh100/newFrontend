
import { Delete as deleteEntity, MassDelete as deleteMultiple } from '../components/RelayWaitlist';

export function deleteWaitSpot(waitSpot) {
  return () => {
    deleteEntity.commit(waitSpot);
  };
}

export function deleteMultipleWaitSpots(list) {
  return () => {
    deleteMultiple.commit(list);
  };
}
