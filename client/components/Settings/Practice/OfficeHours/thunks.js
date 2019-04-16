
import { httpClient } from '../../../../util/httpClient';

/**
 * Creates a dailyHours instance, setting as default a generic time range.
 *
 * @param date
 * @return {*}
 */
export const createDailyHours = date =>
  httpClient().post('/api/dailySchedules', {
    date,
    practitionerId: null,
    startTime: new Date(1970, 1, 0, 8, 0).toISOString(),
    endTime: new Date(1970, 1, 0, 14, 0).toISOString(),
  });

/**
 * Get the practitioner's finalDailySchedule.
 *
 * @param practitionerId
 * @param startDate
 * @param endDate
 * @returns {Promise}
 */
export const getFinalDailyHours = ({ accountId, startDate, endDate }) =>
  httpClient().get(`/api/accounts/${accountId}/finalDailySchedules`, {
    params: {
      startDate,
      endDate,
    },
  });

/**
 * Update the provided dailySchedule
 *
 * @param scheduleId {uuid}
 * @param body
 * @returns {Promise}
 */
export const updateFinalDailyHours = (scheduleId, body) =>
  httpClient().put(`/api/dailySchedules/${scheduleId}`, body);

/**
 * Delete the provided dailyHours
 *
 * @param scheduleId
 * @return {Promise}
 */
export const deleteDailyHours = scheduleId =>
  httpClient().delete(`/api/dailySchedules/${scheduleId}`);
