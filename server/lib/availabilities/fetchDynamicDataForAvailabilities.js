
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import keys from 'lodash/keys';
import { getProperDateWithZone } from '@carecru/isomorphic';
import { Appointment, Request, DailySchedule, PractitionerRecurringTimeOff } from 'CareCruModels';
import newApiHttpClient from '../../util/newApiHttpClient';

const generateDuringFilterSequelize = (startDate, endDate) => ({
  $or: [
    {
      startDate: {
        gte: new Date(startDate).toISOString(),
        lte: new Date(endDate).toISOString(),
      },
    },
    {
      endDate: {
        gte: new Date(startDate).toISOString(),
        lte: new Date(endDate).toISOString(),
      },
    },
    {
      startDate: {
        lte: new Date(startDate).toISOString(),
      },
      endDate: {
        gte: new Date(endDate).toISOString(),
      },
    },
  ],
});

/**
 * fetchAppointments is an async function that will return the promised query
 * of for a practitioner's timeOffs over a range
 *
 * @param startDate
 * @param endDate
 * @return [appointments]
 */
export function fetchAppointments({ startDate, endDate }) {
  return Appointment.findAll({
    attributes: ['id', 'practitionerId', 'chairId', 'startDate', 'endDate'],

    where: {
      isBookable: false,
      ...Appointment.getCommonSearchAppointmentSchema(),
      ...generateDuringFilterSequelize(startDate, endDate),
    },

    order: [['startDate', 'ASC']],
    raw: true,
  });
}

/**
 * fetchRequests is an async function that will return the promised query
 * of for an account's timeOffs over a range
 *
 * @param accountId
 * @param startDate
 * @param endDate
 * @return [requests]
 */
export function fetchRequests({ accountId, startDate, endDate }) {
  return Request.findAll({
    attributes: ['id', 'startDate', 'endDate', 'suggestedPractitionerId'],

    where: {
      accountId,
      isConfirmed: false,
      isCancelled: false,
      ...generateDuringFilterSequelize(startDate, endDate),
    },

    order: [['startDate', 'ASC']],
    raw: true,
  });
}

/**
 * fetchTimeOffs is an async function that will return the promised query
 * of for a practitioner's timeOffs over a range
 *
 * @param practitionerIds
 * @param startDate
 * @param endDate
 * @return [practitionerRecurringTimeOffs]
 */
export function fetchTimeOffs({ practitionerIds, startDate, endDate }) {
  return PractitionerRecurringTimeOff.findAll({
    attributes: [
      'id',
      'practitionerId',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'interval',
      'allDay',
      'dayOfWeek',
    ],

    where: {
      practitionerId: { $in: practitionerIds },
      ...generateDuringFilterSequelize(startDate, endDate),
    },

    raw: true,
  });
}

/**
 * fetchDailySchedules is an async function that will return the promised query
 * of for a practitioner's dailySchedules over a range
 *
 * @param accountId
 * @param practitionerIds
 * @param startDate
 * @param endDate
 * @param timezone
 * @return [dailySchedules]
 */
export function fetchDailySchedules({ accountId, practitionerIds, startDate, endDate, timezone }) {
  const startDateOnly = getProperDateWithZone(startDate, timezone);
  const endDateOnly = getProperDateWithZone(endDate, timezone);
  return DailySchedule.findAll({
    attributes: [
      'id',
      'accountId',
      'practitionerId',
      'date',
      'startTime',
      'endTime',
      'breaks',
      'chairIds',
    ],

    where: {
      date: {
        $between: [startDateOnly, endDateOnly],
      },

      $or: [
        // OfficeHours Overrides
        { accountId,
          practitionerId: null },
        // PractitionerSchedule Overrides
        { practitionerId: { $in: practitionerIds } },
      ],
    },
    raw: true,
  });
}

export function fetchEvents({ accountId, startDate, endDate }) {
  return newApiHttpClient({
    url: '/events/',
    method: 'GET',
    params: {
      accountId,
      'startDate[between][0]': startDate,
      'startDate[between][1]': endDate,
    },
  });
}

/**
 * fetchDynamicDataForAvailabilities is an async function that will get the date-range dependant
 * data for the practitioners involved
 *
 * @param account
 * @param practitioners
 * @param startDate
 * @param endDate
 * @return {Promise<{account, practitioners, chairs, requests}>}
 */
export default async function fetchDynamicDataForAvailabilities({
  account,
  practitioners,
  startDate,
  endDate,
}) {
  const accountId = account.id;
  const practitionerIds = practitioners.map(p => p.id);

  // This is a temporary fix to properly get the allDay availabilities
  const dayBeforeDate = new Date(startDate);
  dayBeforeDate.setHours(dayBeforeDate.getHours() - 24);

  // Start all queries in parallel
  const getAppointments = fetchAppointments({
    practitionerIds,
    startDate,
    endDate,
  });

  const getRequests = fetchRequests({
    accountId,
    startDate,
    endDate,
  });

  const getTimeOffs = fetchTimeOffs({
    practitionerIds,
    startDate: dayBeforeDate.toISOString(),
    endDate,
  });

  const getDailySchedules = fetchDailySchedules({
    accountId,
    practitionerIds,
    startDate,
    endDate,
    timezone: account.timezone,
  });

  const getEvents = fetchEvents({
    accountId,
    startDate,
    endDate,
  });

  // Wait for all queries to finish together but send at same time
  const [appointments, requests, timeOffs, dailySchedules, events] = await Promise.all([
    getAppointments,
    getRequests,
    getTimeOffs,
    getDailySchedules,
    getEvents,
  ]);

  // Grab the account-specific data
  const accountWithData = {
    ...account,
    dailySchedules: dailySchedules.filter(
      d => d.accountId === accountId && d.practitionerId === null,
    ),
  };

  // Group data now in an overall map of practitioners
  const practitionerAppointments = groupBy(appointments, a => a.practitionerId);
  const practitionerRequests = groupBy(requests, d => d.suggestedPractitionerId);
  const practitionerTimeOffs = groupBy(timeOffs, t => t.practitionerId);
  const practitionerDailySchedules = groupBy(dailySchedules, d => d.practitionerId);
  const practitionerEvents = groupBy(
    filter(events, e => has(e, 'practitionerId')),
    e => e.practitionerId,
  );

  const practitionersWithData = practitioners.map((practitioner) => {
    const practitionerId = practitioner.id;
    return {
      ...practitioner,
      appointments: practitionerAppointments[practitionerId] || [],
      timeOffs: practitionerTimeOffs[practitionerId] || [],
      dailySchedules: practitionerDailySchedules[practitionerId] || [],
      requests: practitionerRequests[practitionerId] || [],
      events: practitionerEvents[practitionerId] || [],
    };
  });

  // Group appointments by chairId so we know what chairs have which appointments
  // We don't actually have to fetch chairs as we only want the ones that have appointments
  const chairAppointments = groupBy(appointments, a => a.chairId);
  const chairEvents = groupBy(filter(events, e => has(e, 'chairId')), e => e.chairId);

  const chairs = [...new Set([...keys(chairAppointments), ...keys(chairEvents)])];
  const chairsWithData = chairs.reduce(
    (acc, chairId) => ({
      ...acc,
      [chairId]: {
        appointments: chairAppointments[chairId] || [],
        events: chairEvents[chairId] || [],
      },
    }),
    {},
  );

  return {
    account: accountWithData,
    practitioners: practitionersWithData,
    chairs: chairsWithData,
    requests,
  };
}
