
import { fetchEntitiesRequest } from './fetchEntities';
import { Delete as deleteEntity, MassDelete as deleteMultiple } from '../components/RelayWaitlist';

export function fetchWaitSpots(join = [], params = {}) {
  return (dispatch) => {
    dispatch(fetchEntitiesRequest({
      id: 'waitSpots',
      key: 'waitSpots',
      join,
      params,
    }));
  };
}

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
