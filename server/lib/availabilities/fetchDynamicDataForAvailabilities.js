
import groupBy from 'lodash/groupBy';
import {
  Appointment,
  Service,
  Practitioner,
  Request,
  WeeklySchedule,
  DailySchedule,
  Account,
  Chair,
  PractitionerRecurringTimeOff,
} from '../../_models';
import { getProperDateWithZone } from '../../util/time';

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
 * @param practitionerIds
 * @param startDate
 * @param endDate
 * @return [appointments]
 */
export function fetchAppointments({ practitionerIds, startDate, endDate }) {
  return Appointment.findAll({
    attributes: [
      'id',
      'practitionerId',
      'chairId',
      'startDate',
      'endDate',
    ],

    where: {
      isDeleted: false,
      isCancelled: false,
      isMissed: false,
      isPending: false,
      isBookable: false,
      practitionerId: { $in: practitionerIds },
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
    attributes: [
      'id',
      'startDate',
      'endDate',
      'suggestedPractitionerId',
    ],

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
 * @param practitionerIds
 * @param startDate
 * @param endDate
 * @param timezone
 * @return [dailySchedules]
 */
export function fetchDailySchedules({
  practitionerIds, startDate, endDate, timezone,
}) {
  const startDateOnly = getProperDateWithZone(startDate, timezone);
  const endDateOnly = getProperDateWithZone(endDate, timezone);
  return DailySchedule.findAll({
    attributes: [
      'id',
      'practitionerId',
      'date',
      'startTime',
      'endTime',
      'breaks',
      'chairIds',
    ],

    where: {
      practitionerId: { $in: practitionerIds },
      date: {
        $between: [startDateOnly, endDateOnly],
      },
    },
    raw: true,
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
 * @return {Promise<{requests, practitioners}>}
 */
export default async function fetchDynamicDataForAvailabilities({
  account, practitioners, startDate, endDate,
}) {
  const practitionerIds = practitioners.map(p => p.id);
  
  // This is a temporary fix to properly get the allDay availabilities
  const dayBeforeDate = new Date(startDate);
  dayBeforeDate.setHours(dayBeforeDate.getHours() - 24);

  // Start all queries in parallel
  const getAppointments = fetchAppointments({ practitionerIds, startDate, endDate });
  const getRequests = fetchRequests({ accountId: account.id, startDate, endDate });
  const getTimeOffs = fetchTimeOffs({
    practitionerIds,
    startDate: dayBeforeDate.toISOString(),
    endDate,
  });
  const getDailySchedules = fetchDailySchedules({
    practitionerIds, startDate, endDate, timezone: account.timezone,
  });
  
  // Wait for all queries to finish together but send at same time
  const [
    appointments,
    requests,
    timeOffs,
    dailySchedules,
  ] = await Promise.all([
    getAppointments,
    getRequests,
    getTimeOffs,
    getDailySchedules,
  ]);

  // Group data now in an overall map of practitioners
  const practitionerAppointments = groupBy(appointments, a => a.practitionerId);
  const practitionerRequests = groupBy(requests, d => d.suggestedPractitionerId);
  const practitionerTimeOffs = groupBy(timeOffs, t => t.practitionerId);
  const practitionerDailySchedules = groupBy(dailySchedules, d => d.practitionerId);
  const practitionersWithData = practitioners.map((practitioner) => {
    const practitionerId = practitioner.id;
    return Object.assign(
      {},
      practitioner,
      {
        appointments: practitionerAppointments[practitionerId] || [],
        timeOffs: practitionerTimeOffs[practitionerId] || [],
        dailySchedules: practitionerDailySchedules[practitionerId] || [],
        requests: practitionerRequests[practitionerId] || [],
      },
    );
  });

  return {
    requests,
    practitioners: practitionersWithData,
  };
}
