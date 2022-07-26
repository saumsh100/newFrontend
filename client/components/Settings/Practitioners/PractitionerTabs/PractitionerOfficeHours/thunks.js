
import { httpClient } from '../../../../../util/httpClient';
import { getISODate } from '../../../../library';

/**
 * Creates a dailyHours instance, setting as default a generic time range.
 *
 * @param practitionerId
 * @param date
 * @return {*}
 */
export const createDailyHours = (practitionerId, date) =>
  httpClient().post('/api/dailySchedules', {
    date,
    practitionerId,
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
export const getFinalDailyHours = ({ practitionerId, startDate, endDate,timezone }) =>
  httpClient().get(`/api/practitioners/${practitionerId}/finalDailySchedules`, {
    params: {
      startDate:getISODate(new Date(startDate+moment.tz(timezone).format('Z'))),
      endDate:getISODate(new Date(endDate+moment.tz(timezone).format('Z'))),
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

/**
 * Create a Practitioner's weeklyHours
 *
 * @param practitioner
 * @return {*}
 */
export const createPractitionerWeeklyHours = practitioner =>
  updatePractitionerWeeklyHours(practitioner, true);

/**
 * Delete a Practitioner's weeklyHours
 *
 * @param practitioner
 * @return {*}
 */
export const deletePractitionerWeeklyHours = practitioner =>
  updatePractitionerWeeklyHours(practitioner, false);

/**
 * Update Practitioner's weeklyHours (customSchedule) value.
 *
 * @param practitioner
 * @param isCustom
 * @return {*}
 */
const updatePractitionerWeeklyHours = (practitioner, isCustom) =>
  httpClient().put(
    `/api/practitioners/${practitioner.get('id')}/customSchedule`,
    practitioner.set('isCustomSchedule', isCustom),
  );
