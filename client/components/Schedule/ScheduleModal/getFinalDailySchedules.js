
import axios from 'axios';

export default ({ practitionerIds, fromDate }) =>
  axios.get('/api/dailySchedules/finalDailySchedules', {
    params: {
      fromDate,
      practitionerIds,
    },
  });
