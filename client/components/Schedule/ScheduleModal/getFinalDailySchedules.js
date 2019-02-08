
import axios from 'axios';
import { addOffset } from '@carecru/isomorphic';

export default ({ practitionerIds, fromDate, toDate, reasonId }) =>
  axios.get('/api/dailySchedules/finalDailySchedules', {
    params: {
      fromDate,
      toDate: toDate || addOffset(fromDate, '1 day').toISOString(),
      reasonId,
      practitionerIds,
    },
  });
