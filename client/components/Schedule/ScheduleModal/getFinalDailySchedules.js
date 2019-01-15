
import axios from 'axios';
import { addOffset } from '@carecru/isomorphic';

export default ({ practitionerIds, fromDate, reasonId }) =>
  axios.get('/api/dailySchedules/finalDailySchedules', {
    params: {
      fromDate,
      toDate: addOffset(fromDate, '1 day').toISOString(),
      reasonId,
      practitionerIds,
    },
  });
