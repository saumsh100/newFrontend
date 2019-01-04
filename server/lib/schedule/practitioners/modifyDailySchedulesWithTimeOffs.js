
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import mapValues from 'lodash/mapValues';
import { getRangeOfDays } from '../../../util/time';

const moment = extendMoment(Moment);

/**
 * modifyDailySchedulesWithTimeOffs is a function that takes the dailySchedules, timeOffs and timezone
 * into account and makes changes to dailySchedules from the timeOffs
 *
 * - If the time off is between the start time and end time of the schedule a break is created
 * - If the time off's start date in between the start time and end time of the schedule then
 * change the end time of schedule with the start date of time Offs
 * - If the time off's end date in between the start time and end time of the schedule then
 * change the start time of schedule with the end date of time Offs
 *
 * eg of result: for April 2nd 2018:
 * { '2018-04-02':
 *      { breaks: [{
 *         startTime: '2018-04-02T17:00:00.000Z',
 *         endTime: '2018-04-02T18:00:00.000Z'
 *         }],
 *        startTime: '2018-04-02T16:00:00.000Z',
 *        chairIds: [],
 *        isClosed: false,
 *        endTime: '2018-04-02T23:00:00.000Z',
 *        pmsScheduleId: null } }
 *
 * @param dailySchedules - array
 * @param timeOffs - array
 * @param timezone - the timezone as a string
 * @returns {object} - map of dailySchedules
 */
export default function modifyDailySchedulesWithTimeoffs(dailySchedules, timeOffs, timezone) {
  // Add isModifiedByTimeOff to all dailySchedules, let the code below correct
  // it to be true
  const dailySchedulesCopy = mapValues(dailySchedules, (value) => {
    const newDailySchedule = Object.assign({}, value);
    newDailySchedule.isModifiedByTimeOff = false;
    return newDailySchedule;
  });

  timeOffs.forEach((timeOff) => {
    const tstart = timeOff.startDate;
    const tend = timeOff.endDate;
    const days = getRangeOfDays(timeOff.startDate, timeOff.endDate, timezone);

    for (const day of days) {
      const dailySchedule = dailySchedulesCopy[day];
      if (!dailySchedule) continue;

      // Useful to keep record (logs, tests, UI in future, etc.)
      dailySchedule.isModifiedByTimeOff = true;

      if (!dailySchedule.isClosed) {
        if (timeOff.allDay) {
          dailySchedule.isClosed = true;
        } else {
          const scheduleRange = moment.range(
            moment(dailySchedule.startTime),
            moment(dailySchedule.endTime),
          );
          const isStartDateBetweenSchedule = scheduleRange.contains(moment(tstart));
          const isEndDateBetweenSchedule = scheduleRange.contains(moment(tend));
          const isStartDateBeforeStartTime = moment(tstart).isBefore(dailySchedule.startTime);
          const isEndDateAfterEndTime = moment(tend).isAfter(dailySchedule.endTime);

          if (isStartDateBeforeStartTime && isEndDateAfterEndTime) {
            dailySchedule.isClosed = true;
          } else if (isStartDateBetweenSchedule && isEndDateBetweenSchedule) {
            const newBreak = {
              startTime: tstart,
              endTime: tend,
              isTimeOff: true,
            };

            dailySchedule.breaks.push(newBreak);
            dailySchedule.breaks.sort((a, b) => moment(a.startTime).isBefore(b.startTime));
          } else if (isStartDateBetweenSchedule && !isEndDateBetweenSchedule) {
            dailySchedule.endTime = tstart;
          } else if (!isStartDateBetweenSchedule && isEndDateBetweenSchedule) {
            dailySchedule.startTime = tend;
          } else {
            dailySchedule.isModifiedByTimeOff = false;
          }
        }
      }
    }
  });

  return dailySchedulesCopy;
}
