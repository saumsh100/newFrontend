
import { fetchEntitiesRequest } from './fetchEntities';
import deleteEntity from '../components/RelayWaitlist/deleteWaitSpot';

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

export function deleteWaitSpot(id) {
  return () => {
    deleteEntity.commit({ id });
  };
}
