
import isArray from 'lodash/isArray';
import unionBy from 'lodash/unionBy';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import {
  getProperDateWithZone,
  getRangeOfDays,
  getISOSortPredicate,
  convertToDate,
} from '@carecru/isomorphic';
import produceFinalDailySchedulesMap from '../schedule/practitioners/produceFinalDailySchedulesMap';
import mergeDailySchedules from '../schedule/mergeDailySchedules';
import getMostPopularValue from './helpers/getMostPopularValue';
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
  const { fillers, openings, dailySchedule } = data;

  let availabilities = [];
  for (const opening of openings) {
    availabilities = [
      ...availabilities,
      ...createAvailabilitiesFromOpening({ ...opening, duration, interval }),
    ];
  }

  const { chairIds } = dailySchedule;
  const suggestedPractitionerId = practitioner.id;
  const suggestedChairId = getMostPopularValue(fillers, 'chairId') ||
    (isArray(chairIds) && chairIds.length ?
      chairIds[0] :
      null);


  availabilities = availabilities.map((availability) => {
    availability.practitionerId = suggestedPractitionerId;
    availability.chairId = suggestedChairId;
    return availability;
  });

  data.availabilities = availabilities;
  return data;
}

/**
 * computeDatesAndInvertFillers is a function that will handle computing the
 * boundaries of a search range before passing the fillers into invertFillers
 * (mainly created to dry up code in computeOpeningsDataForDay)
 *
 * @param fillers
 * @param dailySchedule
 * @param startDate
 * @param endDate
 * @return {ranges[]}
 */
export function computeDatesAndInvertFillers({
  fillers,
  dailySchedule,
  startDate,
  endDate,
}) {
  // Make sure to get the correct boundary, use Date as invertFillers needs consistency
  const dsStart = convertToDate(dailySchedule.startTime);
  const dsEnd = convertToDate(dailySchedule.endTime);
  const start = startDate < dsStart ? dsStart : startDate;
  const end = endDate > dsEnd ? dsEnd : endDate;
  return invertFillers(fillers, start, end);
}

/**
 * computeOpeningsDataForDay is a function that will determine the openings data for
 * assuming the "fillers" data supplied is for a single day
 *
 * @param options
 * @returns data { openings, fillers, dailySchedule }
 */
export function computeOpeningsDataForDay(options) {
  const {
    appointments,
    requests,
    chairs,
    dailySchedule,
    startDate,
    endDate,
    useChairAppointments = false,
    usePractitionerAppointments = true,
  } = options;

  // Depending on the configurations decide which appointments to take into account
  const { chairIds = [] } = dailySchedule;
  const totalAppointments = [
    ...(usePractitionerAppointments ? appointments : []),
    ...(useChairAppointments ? chairIds.reduce((chairAppointments, chairId) => ([
      ...chairAppointments,
      ...(chairs[chairId] ? chairs[chairId].appointments : []),
    ]), []) : [])
  ];

  // If a practitioner has all its appointments in its assigned chair, this ensures
  // we aren't duplicating the fillers we need to check openings between
  const finalAppointments = uniqBy(totalAppointments, 'id');

  // Attach { type } attribute to the objects for more detailed logging and debugging at the end
  const appointmentsWithType = finalAppointments.map(a => ({ ...a, type: 'Appnt' }));
  const requestsWithType = requests.map(r => ({ ...r, type: 'Reqst' }));
  const breaks = dailySchedule.breaks || [];
  const properBreaks = breaks.map(b => ({ ...b, startDate: b.startTime, endDate: b.endTime, type: 'Break' }));
  const fillers = appointmentsWithType
    .concat(requestsWithType, properBreaks)
    // As a safety check, convert all dates to Date objects
    .map(({ startDate, endDate, ...rest }) => ({
      ...rest,
      startDate: convertToDate(startDate),
      endDate: convertToDate(endDate),
    }))
    .sort((a, b) => a.startDate - b.startDate);

  return {
    fillers,
    dailySchedule,
    openings: (!dailySchedule || dailySchedule.isClosed) ?
      [] :
      computeDatesAndInvertFillers({
        fillers,
        dailySchedule,
        startDate,
        endDate,
      }),
  };
}

/**
 * computeOpeningsForPractitioner is a function that will compute the openings in a practitioner's
 * schedule
 *
 * @param options.account
 * @param options.chairs
 * @param options.weeklySchedule
 * @param options.timeOffs
 * @param options.dailySchedules
 * @param options.appointments
 * @param options.requests
 * @param options.startDate
 * @param options.endDate
 * @return {data}
 */
export function computeOpeningsForPractitioner(options) {
  const {
    account,
    chairs,
    weeklySchedule,
    timeOffs,
    dailySchedules,
    appointments,
    requests,
  } = options;

  let {
    startDate,
    endDate,
  } = options;

  // invertFillers function needs consistency in dates therefore need to ensure Date and not ISO string
  startDate = convertToDate(startDate);
  endDate = convertToDate(endDate);

  const { timezone } = account;
  const practitionerDailySchedules = produceFinalDailySchedulesMap(
    weeklySchedule,
    dailySchedules,
    timeOffs,
    startDate,
    endDate,
    timezone,
  );

  // Could probably be moved out of this function as it does not change for each practitioner
  // it is run for when looping over practitioners
  const officeHoursDaySchedules = produceFinalDailySchedulesMap(
    account.weeklySchedule,
    account.dailySchedules,
    [], // timeOffs don't apply to officeHours
    startDate,
    endDate,
    timezone,
  );

  // Merge officeHours dailySchedules & practitioner dailySchedules
  const finalDailySchedules = mapValues(practitionerDailySchedules, (practitionerDailySchedule, date) => {
    return mergeDailySchedules(officeHoursDaySchedules[date], practitionerDailySchedule);
  });

  // Group fillers by day with timezone taken into account for the day
  const appointmentsByDay = groupBy(appointments, a => getProperDateWithZone(a.startDate, timezone));
  const requestsByDay = groupBy(requests, r => getProperDateWithZone(r.startDate, timezone));

  // For each day in the range from startDate, endDate
  // Grab all fillers that need to be accommodated
  // And then produce the openings based on the dailySchedule
  const days = getRangeOfDays(startDate, endDate, timezone);
  return days.reduce((openingsData, day) => ({
    ...openingsData,
    [day]: computeOpeningsDataForDay({
      appointments: appointmentsByDay[day] || [],
      requests: requestsByDay[day] || [],
      dailySchedule: finalDailySchedules[day] || {},
      chairs: mapValues(chairs, chair => ({
        ...chair,
        // Only pass in the appointments that are in the day you are checking
        appointments: chair.appointments.filter(a =>
          day === getProperDateWithZone(a.startDate, timezone)
        ),
      })),

      startDate,
      endDate,
    }),
  }), {});
}

/**
 * computeOpeningsAndAvailabilities is a function that will compute the openings
 * for all practitioners and then reduce those into availabilities given certain configurations
 *
 * @param options.account
 * @param options.service
 * @param options.practitioners
 * @param options.chairs
 * @param options.startDate
 * @param options.endDate
 * @return {data} - availabilities, nextAvailability, practitionersData: [{openingsData}]
 */
export default function computeOpeningsAndAvailabilities(options) {
  const {
    account,
    service,
    practitioners,
    chairs,
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
    requests,
  }) => computeOpeningsForPractitioner({
    account,
    chairs,
    weeklySchedule,
    dailySchedules,
    timeOffs,
    appointments,
    requests,
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

  // Sort total availabilities by startDate and then ensure unique startDates
  // Don't worry about losing important info, availabilities per practitioner per day is in practitionerData
  totalAvailabilities = unionBy(totalAvailabilities.sort(getISOSortPredicate('startDate')), 'startDate');

  // Now ensure that availabilities that have suggestedChairId=null will get the account's suggestedChairId
  totalAvailabilities = totalAvailabilities.map(availability => Object.assign(
    {},
    availability,
    { chairId: availability.chairId || account.suggestedChairId },
  ));

  return {
    availabilities: totalAvailabilities,
    nextAvailability: totalAvailabilities[0],
    practitionersData: openingsAvailabilitiesDataByPractitioner,
  };
}
