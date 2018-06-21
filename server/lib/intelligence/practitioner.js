
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import { Account, Practitioner, DailySchedule, PractitionerRecurringTimeOff, sequelize, WeeklySchedule } from '../../_models';
import {
  getProperDateWithZone,
} from '../../util/time';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const moment = extendMoment(Moment);

function getDiffInMin(startDate, endDate) {
  return moment(endDate).diff(moment(startDate), 'minutes');
}

const generateDuringFilterSequelize = (startDate, endDate) => {
  return {
    $or: [
      {
        startDate: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
      {
        endDate: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
      {
        endDate: {
          gt: new Date(endDate).toISOString(),
        },
        startDate: {
          lt: new Date(startDate).toISOString(),
        },
      },
    ],
  };
};

export async function getPractitionerData(practitionerId, startDate, endDate, timezone) {
  const startDateOnly = getProperDateWithZone(startDate, timezone);
  const endDateOnly = getProperDateWithZone(endDate, timezone);

  let practitioner = await Practitioner.findOne({
    where: {
      id: practitionerId,
    },
    include: [
      {
        model: PractitionerRecurringTimeOff,
        as: 'recurringTimeOffs',
        where: {
          ...generateDuringFilterSequelize(startDate, endDate),
        },
        required: false,
      },
      {
        model: DailySchedule,
        as: 'dailySchedules',
        where: {
          date: {
            $between: [startDateOnly, endDateOnly],
          },
        },
        required: false,
      },
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
        required: true,
      },
    ],
  });

  practitioner = practitioner.get({ plain: true });
  if (!practitioner.isCustomSchedule) {
    const account = await Account.findOne({
      where: {
        id: practitioner.accountId,
      },
      include: [
        {
          model: WeeklySchedule,
          as: 'weeklySchedule',
          required: true,
        },
      ],
      raw: true,
      nest: true,
    });

    practitioner.weeklySchedule = account.weeklySchedule;
  }

  return practitioner;
}

/**
 * [practitionersTotalHours calculates the total hours a practitioner will work
 * during a period without time offs]
 * @param  {[object]} schedule
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @return {[float]}           [hours as a float]
 */
export function practitionersTotalHours(schedule, startDate, endDate) {
  let timeOpen = 0;
  const numberOfDays = moment(endDate).diff(moment(startDate), 'days');
  const dayOfWeek = moment(startDate).day();
  const weeks = Math.floor(numberOfDays / 7);
  const remainingDays = numberOfDays % 7;

  let numberOfRecurrings = 1;

  if (schedule.isAdvanced) {
    numberOfRecurrings = schedule.weeklySchedules.length + 1;
  }

  for (let i = 0; i < numberOfRecurrings; i += 1) {
    if (i === 0) {
      timeOpen += weeklyHoursFromSchedule(schedule);
    } else {
      timeOpen += weeklyHoursFromSchedule(schedule.weeklySchedules[i - 1]);
    }
  }

  timeOpen *= Math.floor(weeks / numberOfRecurrings);

  if (numberOfRecurrings !== 1 && weeks % numberOfRecurrings !== 0) {
    const daysPast = Math.floor(weeks / numberOfRecurrings) * 7;
    const daysLeft = (weeks % numberOfRecurrings) * 7;
    const currentDay = moment(startDate).add(daysPast, 'days');

    for (let i = 0; i < daysLeft; i += 1) {
      let scheduleUse = schedule;
      const weeksDiff = currentDay.diff(moment(startDate), 'days') % numberOfRecurrings;

      if (weeksDiff !== 0) {
        scheduleUse = schedule.weeklySchedules[weeksDiff - 1];
      }

      const dayOfWeek2 = currentDay.day();

      const index = (i + dayOfWeek2) % 7;

      timeOpen += hoursFromDay(scheduleUse[daysOfWeek[index]]);

      currentDay.add(1, 'days');
    }
  }

  for (let i = 0; i < remainingDays; i += 1) {
    let scheduleUse = schedule;
    const index = (i + dayOfWeek) % 7;
    if (numberOfRecurrings !== 1) {
      const currentDay = moment(startDate).add(weeks * 7, 'days');

      const weeksDiff = currentDay.diff(moment(startDate), 'days') % numberOfRecurrings;

      if (weeksDiff !== 0) {
        scheduleUse = schedule.weeklySchedules[weeksDiff - 1];
      }
    }

    timeOpen += hoursFromDay(scheduleUse[daysOfWeek[index]]);
  }

  return timeOpen;
}

/**
 * [breaksAllTime calculated breaks from breaks array]
 * @param  {[array]} breaks
 * @return {[float]}        [breaks in hours]
 */
function breaksAllTime(breaks) {
  return breaks.reduce((sum, value) => {
    sum += getDiffInMin(value.startTime, value.endTime);
    return sum;
  }, 0) / 60;
}

export async function practitionersAll(startDate, endDate, accountId) {
  const practitioners = await Practitioner.findAll({
    where: {
      accountId,
      isActive: true,
    },
    include: [
      {
        model: PractitionerRecurringTimeOff,
        as: 'recurringTimeOffs',
        where: {
          ...generateDuringFilterSequelize(startDate, endDate),
        },
        required: false,
      },
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
        required: true,
      },
    ],
  });

  const account = await Account.findOne({
    where: {
      id: accountId,
    },
    include: [
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
        required: true,
      },
    ],
    raw: true,
    nest: true,
  });

  return practitioners.map(p => {
    const prac = p.get({ plain: true });
    prac.recurringTimeOffs = recurringTimeOffsFilter(prac.recurringTimeOffs, startDate, endDate);

    if (prac.isCustomSchedule) {
      prac.hours = practitionersTotalHours(prac.weeklySchedule, startDate, endDate);
      prac.timeOffHours = practitionersTimeOffHours(prac.weeklySchedule, prac.recurringTimeOffs, startDate, endDate);
    } else {
      prac.hours = practitionersTotalHours(account.weeklySchedule, startDate, endDate);
      prac.timeOffHours = practitionersTimeOffHours(account.weeklySchedule, prac.recurringTimeOffs, startDate, endDate);
    }
    return prac;
  });
}

function hoursFromDay(day) {
  if (day.isClosed) {
    return 0;
  }

  let minutes = getDiffInMin(day.startTime, day.endTime);

  minutes -= breaksAllTime(day.breaks || []);

  return minutes / 60;
}

function weeklyHoursFromSchedule(schedule) {
  return hoursFromDay(schedule.monday) + hoursFromDay(schedule.tuesday)
  + hoursFromDay(schedule.wednesday) + hoursFromDay(schedule.thursday)
  + hoursFromDay(schedule.friday) + hoursFromDay(schedule.saturday) +
  hoursFromDay(schedule.sunday);
}

/**
 * [hoursFromTimeOff the time of a timeOff in hours]
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @return {[float]}           [hours as a timeOff]
 */
function hoursFromTimeOff(startDate, endDate) {
  const start = moment(startDate);
  const end = moment(endDate);

  return ((end.get('minute') + (end.get('hour') * 60)) - (start.get('minute') + (start.get('hour') * 60))) / 60;
}

/**
 * [practitionersTimeOffHours calculates the amount of timeOffs in hours]
 * @param  {[object]} schedule
 * @param  {[array]} timeOffs
 * @param  {[date]} startDateQuery
 * @param  {[date]} endDateQuery
 * @return {[float]}                [timeOff in hours]
 */
export function practitionersTimeOffHours(schedule, timeOffs, startDateQuery, endDateQuery) {
  let hours = 0;

  for (let i = 0; i < timeOffs.length; i += 1) {
    const {
      startDate,
      endDate,
      allDay,
    } = timeOffs[i];

    // check if it's an all day time Off which means the schedule day hours is the full day
    // else it's the timeOff
    if (allDay) {
      const startDateClone = moment(startDate).clone();

      const test = startDateClone.isSame(endDate, 'd');

      if (test) {
        const day = daysOfWeek[startDateClone.isoWeekday() - 1];
        hours += hoursFromDay(schedule[day]);
      } else {
        // loop through the days in the range of the timeOffs and calculate the timeOffs
        while (startDateClone.isBefore(endDate) || startDateClone.isSame(endDate, 'd')) {
          if (!startDateClone.isBetween(startDateQuery, endDateQuery)) {
            startDateClone.add(1, 'days');
            continue;
          }
          const testSameDay = startDateClone.isSame(endDate, 'd');

          const day = daysOfWeek[startDateClone.isoWeekday() - 1];
          hours += hoursFromDay(schedule[day]);

          if (testSameDay) {
            break;
          } else {
            startDateClone.add(1, 'days');
          }
        }
      }
    } else {
      const startDateClone = moment(startDate).clone();

      const test = startDateClone.isSame(endDate, 'd')

      if (test) {
        hours += hoursFromTimeOff(timeOffs[i].startDate, timeOffs[i].endDate);
      } else {
        // loop through the days in the range of the timeOffs and calculate the timeOffs
        while (startDateClone.isBefore(endDate) || startDateClone.isSame(endDate, 'd')) {
          if (!startDateClone.isBetween(startDateQuery, endDateQuery)) {
            startDateClone.add(1, 'days');
            continue;
          }
          const testSameDay = startDateClone.isSame(endDate, 'd');

          hours += hoursFromTimeOff(timeOffs[i].startDate, timeOffs[i].endDate);

          if (testSameDay) {
            break;
          } else {
            startDateClone.add(1, 'days');
          }
        }
      }
    }
  }
  return hours;
}

export async function practitionersTimeOffs(startDate, endDate, accountId) {
  const pracs = await practitionersAll(startDate, endDate, accountId);

  return pracs;
}

/**
 * recurringTimeOffsFilter converts
 * all time offs (including recurring) to timeoffs in a given period
 *
 * @param  {[array]} recurringTimeOffs
 * @param  {[date]} startDate
 * @param  {[date]} endDate
 * @return {[array]} [array of objects of timeOffs]
 */
export function recurringTimeOffsFilter(recurringTimeOffs, startDate, endDate) {
  const fullTimeOffs = [];
  for (let i = 0; i < recurringTimeOffs.length; i++) {
    if (!recurringTimeOffs[i].dayOfWeek) {
      fullTimeOffs.push(recurringTimeOffs[i]);
      continue;
    }

    let startDay;
    let endDay;

    if (recurringTimeOffs[i].allDay) {
      startDay = recurringTimeOffs[i].startDate;
      endDay = recurringTimeOffs[i].startDate;
    } else {
      startDay = new Date(recurringTimeOffs[i].startDate);
      const startTime = new Date(recurringTimeOffs[i].startTime);
      startDay.setHours(startTime.getHours());
      startDay.setMinutes(startTime.getMinutes());

      endDay = new Date(recurringTimeOffs[i].startDate);
      const endTime = new Date(recurringTimeOffs[i].endTime);
      endDay.setHours(endTime.getHours());
      endDay.setMinutes(endTime.getMinutes());
    }

    const start = moment(startDay);
    const end = moment(endDay);

    const dayOfWeek = moment().day(recurringTimeOffs[i].dayOfWeek).isoWeekday();

    const tmpStart = start.clone().day(dayOfWeek);
    const tmpEnd = end.clone().day(dayOfWeek);

    let count = 1;

    // test for first day of the week (seeing if it comes before or after when we changed the day of the week)

    if (tmpStart.isAfter(start, 'd') || tmpStart.isSame(start, 'd')) {

      if (tmpStart.isAfter(startDate)) {
        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }

      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    } else {
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');

      if (tmpStart.isAfter(startDate)) {

        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }

      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    }

    // loop through and create regular time offs until the end date of the requested avaliabilities
    while (tmpStart.isBefore(moment(recurringTimeOffs[i].endDate)) && tmpStart.isBefore(endDate)) {
      if ((count % recurringTimeOffs[i].interval === 0) && (count >= recurringTimeOffs[i].interval) && moment(startDate).isBefore(tmpStart)) {
        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }

      count++;
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    }
  }

  return fullTimeOffs;
}
