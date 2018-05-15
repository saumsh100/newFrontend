
import isArray from 'lodash/isArray';
import unionBy from 'lodash/unionBy';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import produceFinalDailySchedulesMap from '../schedule/produceFinalDailySchedulesMap';
import {
  getProperDateWithZone,
  getRangeOfDays,
  getISOSortPredicate,
  convertToDate,
} from '../../util/time';
import invertFillers from './invertFillers';
import createAvailabilitiesFromOpening from './createAvailabilitiesFromOpening';

/**
 * getCorrectPractitonerWeeklySchedule will modify the practitioner's weeklySchedule
 * by assigning the account's officeHours if isCustomSchedule is false
 *
 * @param account
 * @param practitioner
 * @return mutated practitioner
 */
export function getCorrectPractitionerWeeklySchedule(account, practitioner) {
  if (!practitioner.isCustomSchedule) {
    practitioner.weeklySchedule = account.weeklySchedule;
  }

  return practitioner;
}

/**
 * addAvailabilitiesToOpeningsData will add availabilities to openingsData
 * by day
 *
 * @param data
 * @param practitioner
 * @param duration
 * @param interval
 * @return mutated data w/ availabilities
 */
export function addAvailabilitiesToOpeningsData(data, practitioner, duration, interval) {
  const { openings, dailySchedule } = data;

  let availabilities = [];
  for (const opening of openings) {
    availabilities = [
      ...availabilities,
      ...createAvailabilitiesFromOpening({ ...opening, duration, interval }),
    ];
  }

  const { chairIds } = dailySchedule;
  const suggestedPractitionerId = practitioner.id;
  const suggestedChairId = isArray(chairIds) && chairIds.length ?
    chairIds[0] :
    null;

  availabilities = availabilities.map((availability) => {
    availability.suggestedPractitionerId = suggestedPractitionerId;
    availability.suggestedChairId = suggestedChairId;
    return availability;
  });

  data.availabilities = availabilities;
  return data;
}

/**
 * computeOpeningsForPractitioner is a function that will compute the openings in a practitioner's
 * schedule
 *
 * @param account
 * @param weeklySchedule
 * @param timeOffs
 * @param dailySchedules
 * @param appointments
 * @return {data}
 */
export function computeOpeningsForPractitioner({ account, weeklySchedule, timeOffs, dailySchedules, appointments, startDate, endDate }) {
  // invertFillers function needs consistency therefore need to ensure Date and not ISO string
  startDate = convertToDate(startDate);
  endDate = convertToDate(endDate);

  const { timezone } = account;
  const finalDailySchedules = produceFinalDailySchedulesMap(
    weeklySchedule,
    dailySchedules,
    timeOffs,
    startDate,
    endDate,
    timezone,
  );

  // Group fillers by day with timezone taken into account for the day
  const appointmentsByDay = groupBy(appointments, a => getProperDateWithZone(a.startDate, timezone));

  // For each day in the range from startDate, endDate
  // Grab all fillers ordered by startDate (including breaks)
  // And then produce the openings based on the dailySchedule
  const data = {};
  const days = getRangeOfDays(startDate, endDate, timezone);
  for (const day of days) {
    const dailySchedule = finalDailySchedules[day] || {};
    const appointments = appointmentsByDay[day] || [];
    const breaks = dailySchedule.breaks || [];
    const properBreaks = breaks.map(b => ({ ...b, startDate: b.startTime, endDate: b.endTime, isBreak: true }));
    const fillers = appointments
      .concat(properBreaks)
      // As a safety check, convert all dates to Date objects
      .map(({ startDate, endDate, ...rest }) => ({
        ...rest,
        startDate: convertToDate(startDate),
        endDate: convertToDate(endDate),
      }))
      .sort((a, b) => a.startDate - b.startDate);

    data[day] = { fillers, dailySchedule };

    if (!dailySchedule || dailySchedule.isClosed) {
      data[day].openings = [];
    } else {
      // Make sure to get the correct boundary, use Date as invertFillers needs consistency
      const dsStart = convertToDate(dailySchedule.startTime);
      const dsEnd = convertToDate(dailySchedule.endTime);
      const start = startDate < dsStart ? dsStart : startDate;
      const end = endDate > dsEnd ? dsEnd : endDate;
      const openings = invertFillers(fillers, start, end);
      data[day].openings = openings;
    }
  }

  return data;
}

/**
 * computeOpeningsAndAvailabilities is a function that will compute the openings
 * for all practitioners and then reduce those into availabilities given certain configurations
 *
 * @param options.account
 * @param options.practitioners
 * @param options.startDate
 * @param options.endDate
 * @return {data} - availabilities, nextAvailability, practitionersData: [{openingsData}]
 */
export default function computeOpeningsAndAvailabilities(options) {
  const {
    account,
    service,
    practitioners,
    startDate,
    endDate,
  } = options;

  const { duration } = service;
  const interval = account.timeInterval || 30;

  // Put the correct weeklySchedule on the practitioner
  const practitionersWithProperSchedule = practitioners.map(p => getCorrectPractitionerWeeklySchedule(account, p));

  const openingsDataByPractitioner = practitionersWithProperSchedule.map(({
    weeklySchedule,
    dailySchedules,
    timeOffs,
    appointments,
  }) => computeOpeningsForPractitioner({
    account,
    weeklySchedule,
    dailySchedules,
    timeOffs,
    appointments,
    startDate,
    endDate,
  }));

  // Collect totalAvailabilities efficiently by tapping into the map function
  let totalAvailabilities = [];
  const openingsAvailabilitiesDataByPractitioner = openingsDataByPractitioner.map((openingsData, i) => {
    const practitioner = practitioners[i];
    const openingsDataWithAvailabilities = mapValues(openingsData, (data) => {
      const dataWithAvailabilities = addAvailabilitiesToOpeningsData(
        data,
        practitioner,
        duration,
        interval,
      );

      totalAvailabilities = [...totalAvailabilities, ...dataWithAvailabilities.availabilities];
      return dataWithAvailabilities;
    });

    return {
      ...practitioner,
      openingsData: openingsDataWithAvailabilities,
    };
  });

  // Sort total availabilities by startDatre and then ensure unique startDates
  // Don't worry about losing important info, availabilities per practitioner per day is in practitionerData
  totalAvailabilities = unionBy(totalAvailabilities.sort(getISOSortPredicate('startDate')), 'startDate');

  return {
    availabilities: totalAvailabilities,
    nextAvailability: totalAvailabilities[0],
    practitionersData: openingsAvailabilitiesDataByPractitioner,
  };
}
