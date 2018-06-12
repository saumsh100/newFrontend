
import { fetchEntitiesRequest } from './fetchEntities';
import { Delete as deleteEntity } from '../components/RelayWaitlist';

export function fetchWaitSpots(join = [], params = {}) {
  return (dispatch) => {
    dispatch(
      fetchEntitiesRequest({
        id: 'waitSpots',
        key: 'waitSpots',
        join,
        params,
      })
    );
  };
}

export function deleteWaitSpot(waitSpot) {
  return () => {
    deleteEntity.commit(waitSpot);
  };
}
