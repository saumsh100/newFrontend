
import { Delete as deleteEntity, MassDelete as deleteMultiple } from '../components/RelayWaitlist';
import { fetchEntities } from './fetchEntities';

export const deleteWaitSpot = waitSpot => () => {
  deleteEntity.commit(waitSpot);
};

export const deleteMultipleWaitSpots = list => () => {
  deleteMultiple.commit(list);
};

export const loadWeeklySchedule = () => dispatch =>
  dispatch(fetchEntities({
    key: 'accounts',
    join: ['weeklySchedule'],
  }));
