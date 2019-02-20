
import { fetchEntities } from './fetchEntities';

// eslint-disable-next-line import/prefer-default-export
export const loadWeeklySchedule = () => dispatch =>
  dispatch(fetchEntities({
    key: 'accounts',
    join: ['weeklySchedule'],
  }));
