
import { addOffset } from '@carecru/isomorphic';
import { httpClient } from '../../../util/httpClient';

export default ({ practitionerIds, fromDate, toDate, reasonId }) =>
  httpClient().get('/api/dailySchedules/finalDailySchedules', {
    params: {
      fromDate,
      toDate: toDate || addOffset(fromDate, '1 day').toISOString(),
      reasonId,
      practitionerIds,
    },
  });
