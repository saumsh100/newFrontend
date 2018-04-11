import Moment from 'moment';
import 'moment-timezone';
import { extendMoment } from 'moment-range';
import {
  getProperDateWithZone,
  mergeDateAndTimeWithZone,
} from '../../util/time';
import { getPractitionerData, recurringTimeOffsFilter } from '../intelligence/practitioner';

const moment = extendMoment(Moment);

/**
 * changes the Daily Schedule array to Object
 * @param dailyScheduleArray
 * @returns {object} - daily Schedules.
 */
export function mapDailySchedule(dailyScheduleArray) {
  const dailyScheduleObject = {};

  dailyScheduleArray.forEach((dailySchedule) => {
    dailyScheduleObject[dailySchedule.date] = dailySchedule;
  });

  return dailyScheduleObject;
}

/**
 * takes weeklySchedule and gets the right
 * week to use (if advanced)
 * @param weeklySchedule - for advance
 * @param date - ISOString
 * @returns {weeklySchedule} - model of the weeklySchedule to use
 */
export function getWeeklyScheduleFromAdvanced(weeklySchedule, date) {
  if (!weeklySchedule.isAdvanced) {
    return weeklySchedule;
  }

  const week = moment(date).diff(weeklySchedule.startDate, 'week') % (weeklySchedule.weeklySchedules.length + 1);
  if (week > 0) {
    return weeklySchedule.weeklySchedules[week - 1];
  }

  return weeklySchedule;
}

/**
 * Takes the startDate, endDate, and Timezone into account and computes the daily
 * Schedule from the data
 * eg of result: for April 2nd 2018:
 * { '2018-04-02':
       { breaks: [{
          startTime: '2018-04-02T17:00:00.000Z',
          endTime: '2018-04-02T18:00:00.000Z'
          }],
         startTime: '2018-04-02T16:00:00.000Z',
         chairIds: [],
         isClosed: false,
         endTime: '2018-04-02T23:00:00.000Z',
         pmsScheduleId: null } }
 * @param practitionerId - uuid
 * @param startDate - ISOString
 * @param endDate - ISOString
 * @param timezone - the timezone as a string
 * @returns {object} - object of dailySchedule with the date as key
 */
export function getDailyScheduleObjects(practitioner, startDate, endDate, timezone) {
  const start = moment(startDate);

  const dailyScheduleObject = mapDailySchedule(practitioner.dailySchedules);

  let dailySchedules = {};
  const daysDiff = moment(endDate).diff(start, 'days');
  for (let i = 0; i <= daysDiff; i += 1) {
    const currentDayISO = start.toISOString();
    const currentWeeklySchedule
      = getWeeklyScheduleFromAdvanced(practitioner.weeklySchedule, currentDayISO);

    const day = getProperDateWithZone(currentDayISO, timezone);

    const dailySchedule = dailyScheduleObject[day];

    if (dailySchedule) {
      dailySchedules[day] = dailySchedule;
    } else {
      dailySchedules[day]
        = currentWeeklySchedule[getDayofWeek(currentDayISO, timezone)];
    }

    start.add(1, 'days');
  }

  // cloning the dailying schedule because from above
  // the reference to startTime for two different days can be the same if
  // the startTime came from the weeklySchedule
  dailySchedules = JSON.parse(JSON.stringify(dailySchedules));

  Object.entries(dailySchedules).forEach(([key, value]) => {
    value.startTime
      = mergeDateAndTimeWithZone(key, dailySchedules[key].startTime, timezone);
    value.endTime
      = mergeDateAndTimeWithZone(key, dailySchedules[key].endTime, timezone);

    value.breaks = value.breaks.map((singleBreak) => {
      return {
        startTime: mergeDateAndTimeWithZone(key, singleBreak.startTime, timezone),
        endTime: mergeDateAndTimeWithZone(key, singleBreak.endTime, timezone),
      };
    });
  });

  return dailySchedules;
}

/**
 * Takes the dailySchedules, timeOffs and Timezone into account and makes changes to daily
 * Schedule from the time offs
 * If the time off is between the start time and end time of the schedule a break is created
 *
 * if the time off's start date in between the start time and end time of the schedule then
 * change the end time of schedule with the start date of time Offs
 *
 * if the time off's end date in between the start time and start time of the schedule then
 * change the start time of schedule with the end date of time Offs
 * eg of result: for April 2nd 2018:
 * { '2018-04-02':
       { breaks: [{
          startTime: '2018-04-02T17:00:00.000Z',
          endTime: '2018-04-02T18:00:00.000Z'
          }],
         startTime: '2018-04-02T16:00:00.000Z',
         chairIds: [],
         isClosed: false,
         endTime: '2018-04-02T23:00:00.000Z',
         pmsScheduleId: null } }
 * @param startDate - ISOString
 * @param endDate - ISOString
 * @param timezone - the timezone as a string
 * @returns {object} - object of dailySchedule with the date as key
 */
export function modifyDailyScheduleWithTimeoffs(dailySchedules, timeoffs, timezone) {
  const dailySchedulesCopy = Object.assign({}, dailySchedules);
  timeoffs.forEach((timeOff) => {
    const start = moment(timeOff.startDate);

    const daysDiff = moment(timeOff.endDate).diff(start, 'days');
    for (let i = 0; i <= daysDiff; i += 1) {
      const date = getProperDateWithZone(start, timezone);
      const dailySchedule = dailySchedulesCopy[date];
      // set the date of endDate to the current DailySchedule
      // to adjust the weeklyschedule for theday
      const end = moment(mergeDateAndTimeWithZone(date, timeOff.endDate, timezone));

      // if daily schedule is closed don't do anything as
      // no time off with change that
      if (dailySchedule && !dailySchedule.isClosed) {
        if (timeOff.allDay) {
          dailySchedule.isClosed = true;
        } else {
          const scheduleRange = moment().range(dailySchedule.startTime, dailySchedule.endTime);
          const isStartDateBetweenSchedule = scheduleRange.contains(start);
          const isEndDateBetweenSchedule = scheduleRange.contains(moment(end));
          const isStartDateBeforeStartTime = moment(start).isBefore(dailySchedule.startTime);
          const isEndDateAfterEndTime = moment(end).isAfter(dailySchedule.endTime);

          if (isStartDateBeforeStartTime && isEndDateAfterEndTime) {
            dailySchedule.isClosed = true;
          } else if (isStartDateBetweenSchedule && isEndDateBetweenSchedule) {
            const newBreak = {
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            };

            dailySchedule.breaks.push(newBreak);

            dailySchedule.breaks.sort((a, b) => moment(a.startTime).isBefore(b.startTime));
          } else if (isStartDateBetweenSchedule && !isEndDateBetweenSchedule) {
            dailySchedule.endTime = start.toISOString();
          } else if (!isStartDateBetweenSchedule && isEndDateBetweenSchedule) {
            dailySchedule.startTime = end.toISOString();
          }
        }
      }

      start.add(1, 'days');
    }
  });
  const filteredDailySchedules = {};

  // filter out daily schedules which are closed.
  Object.entries(dailySchedulesCopy).forEach(([key, value]) => {
    if (!value.isClosed && !moment(value.startTime).isSame(value.endTime)) {
      filteredDailySchedules[key] = value;
    }
  });

  return filteredDailySchedules;
}

/**
 * gets the day of week from a ISOString with respect
 * to the timezone given
 * @param date - ISOString
 * @param timezone - the timezone as a string
 * @returns {string} - the day of the week (lowercase)
 */
export function getDayofWeek(date, timezone) {
  return timezone ?
    moment.tz(date, timezone).format('dddd').toLowerCase() :
    moment(date).format('dddd').toLowerCase();
}

/**
 * Takes the startDate, endDate, and Timezone into account and fetches the
 * daily schedule of the practitioner. After that take into account timeOffs
 * and modify the dailSchedules with them.
 * { '2018-04-02':
      { breaks: [{
         startTime: '2018-04-02T17:00:00.000Z',
         endTime: '2018-04-02T18:00:00.000Z'
         }],
        startTime: '2018-04-02T16:00:00.000Z',
        chairIds: [],
        isClosed: false,
        endTime: '2018-04-02T23:00:00.000Z',
        pmsScheduleId: null } }
 * @param practitionerId - uuid
 * @param startDate - ISOString
 * @param endDate - ISOString
 * @param timezone - the timezone as a string
 * @returns {object} - object of dailySchedule with the date as key
 */
export async function practitionerDailySchedule(practitionerId, startDate, endDate, timezone) {
  const practitioner = await getPractitionerData(practitionerId, startDate, endDate, timezone);
  const dailyScheduleObject = getDailyScheduleObjects(practitioner, startDate, endDate, timezone);
  const timeOffs = recurringTimeOffsFilter(practitioner.recurringTimeOffs, startDate, endDate);

  return modifyDailyScheduleWithTimeoffs(dailyScheduleObject, timeOffs, timezone);
}
