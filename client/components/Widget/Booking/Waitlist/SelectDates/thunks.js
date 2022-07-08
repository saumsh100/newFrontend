import { httpClientbookingWidget } from '../../../../../util/httpClient';

export const getFinalDailyHours = ({ accountId, startDate, endDate }) =>
  httpClientbookingWidget().get(`/my/accounts/${accountId}/finalDailySchedules`, {
    params: {
      startDate,
      endDate,
    },
});
