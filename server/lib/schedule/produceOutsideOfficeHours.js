
import { dateToRelativeTime, setDateToTimezone, addOffset } from '@carecru/isomorphic';
import getNextStartTime from '../../lib/schedule/handleNextStartTimeOpenDays';
import { getMessageFromTemplates } from '../../services/communicationTemplate';
import fetchAndComputeFinalDailySchedules from './fetchAndComputeFinalDailySchedules';

/**
 * Function used to generate a response to the patient when he/she contact the clinic
 * outside the office working hours.
 *
 * @param account {{Account}} Account object
 * @param patientPhoneNumber {string} Patient phone number
 * @param endDayOffset {string} offset to calculate end date based on start date
 * @returns {Promise<string|boolean>}
 */
export default async function produceOutsideOfficeHours({
  timezone,
  canAutoRespondOutsideOfficeHours,
  bufferBeforeOpening,
  bufferAfterClosing,
  id,
  name,
}, patientPhoneNumber, endDayOffset = '30 days') {
  if (!canAutoRespondOutsideOfficeHours || !patientPhoneNumber) return false;

  const currentDate = Date.now();
  const endDate = addOffset(currentDate, endDayOffset);
  const startDate = setDateToTimezone(currentDate, timezone);

  const scheduleList = await fetchAndComputeFinalDailySchedules({
    accountId: id,
    timezone,
    startDate,
    endDate: setDateToTimezone(endDate.toISOString(), timezone),
  });

  const nextOpenDay = await getNextStartTime({
    bufferAfterClosing,
    bufferBeforeOpening,
  }, scheduleList);

  if (!nextOpenDay || nextOpenDay.openAtTheMoment) return false;

  return getMessageFromTemplates(id, 'donna-respond-outside-office-hours', {
    account: { name },
    nextOpenedTime: dateToRelativeTime(nextOpenDay.startTime, timezone, {
      sameDay: '[at] h:mma',
      nextDay() {
        // this function runs within moment's context
        // meaning that "this" refers to the current moment object instance.
        if (this.hours() >= 12 && this.hours() < 18) return '[tomorrow afternoon at] h:mma';
        else if (this.hours() >= 18) return '[tomorrow evening at] h:mma';
        return '[tomorrow morning at] h:mma';
      },
      nextWeek: 'dddd',
      sameElse: 'MM/DD h:mma',
    }, startDate),
  });
}
