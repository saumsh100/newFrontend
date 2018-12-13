
import WeeklySchedule from 'CareCruModels';
import fetchStaticDataForAvailabilities from '../availabilities/fetchStaticDataForAvailabilities';
import fetchDynamicDataForAvailabilities from '../availabilities/fetchDynamicDataForAvailabilities';
import { computeOpeningsForPractitioner } from '../availabilities/computeOpeningsAndAvailabilities';
import produceFinalDailySchedulesMap from '../schedule/produceFinalDailySchedulesMap';
import StatusError from '../../util/StatusError';
import { getRangeOfDays } from '../../util/time';
import { setDateToTimezone } from '../../util/time';

/**
 * Calculate the earliest/last time for a certain period in the clinic's time zone.
 * For example, if the practice is in PDT timezone for date '2018-01-01' to '2018-02-03',
 * this function will return {2018-01-01 00:00:00 PDT, 2018-02-03 23:59:59 PDT}
 *
 * @param fromDate
 * @param toDate
 * @param timezone
 * @returns {{startDate: Date, endDate: Date}}
 */
function getZonedDateTime(fromDate, toDate, timezone) {
  return {
    startDate: setDateToTimezone(fromDate, timezone).startOf('day').toDate(),
    endDate: setDateToTimezone(toDate, timezone).endOf('day').toDate(),
  };
}

/**
 * Generate daily schedules for practitioners in the same practice during a period of time.
 * The response is grouped by the date, see the example response below:
 * {
    "2018-01-01": {
        "0d097fa0-beb4-4c03-b661-f300c5cec76e": {
            "breaks": [],
            "endTime": "2018-01-02T01:00:00.000Z",
            "startTime": "2018-01-01T16:00:00.000Z",
            "isDailySchedule": false,
            "isClosed": true,
            "isModifiedByTimeOff": true
        },
        "1230f60a-ec83-431f-a67e-28142ab43caa": {
            "breaks": [
                {
                    "startTime": "2018-01-01T20:00:00.000Z",
                    "endTime": "2018-01-01T21:00:00.000Z"
                }
            ],
            "endTime": "2018-01-02T01:00:00.000Z",
            "startTime": "2018-01-01T16:00:00.000Z",
            "isDailySchedule": false,
            "isClosed": true,
            "isModifiedByTimeOff": true
        }
    },
    "2018-01-02": {
        "0d097fa0-beb4-4c03-b661-f300c5cec76e": {
            "breaks": [],
            "endTime": "2018-01-03T01:00:00.000Z",
            "startTime": "2018-01-02T16:00:00.000Z",
            "isDailySchedule": false,
            "isClosed": false,
            "isModifiedByTimeOff": false
        },
        "1230f60a-ec83-431f-a67e-28142ab43caa": {
            "breaks": [],
            "endTime": "2018-01-03T01:00:00.000Z",
            "startTime": "2018-01-02T16:00:00.000Z",
            "isDailySchedule": true,
            "isClosed": false,
            "isModifiedByTimeOff": false
        }
    }
}
 * @param inputPractitioners
 * @param fromDate
 * @param toDate
 * @returns {Promise<>}
 */
export default async function generateDailySchedulesForPractitioners(inputPractitioners, fromDate, toDate) {
  if (!inputPractitioners.length) {
    throw StatusError(
      StatusError.BAD_REQUEST,
      'Practitioner list cannot be empty, please make sure your params are in the correct format',
    );
  }

  // Office hour should be the same for all the practitioner
  const { accountId, id: practitionerId } = inputPractitioners[0];
  const { account } = await fetchStaticDataForAvailabilities({
    accountId,
    practitionerId,
  });
  const {
    timezone,
    weeklySchedule: officeHours,
  } = account.dataValues;
  const { startDate, endDate } = getZonedDateTime(fromDate, toDate, timezone);
  const { practitioners } = await fetchDynamicDataForAvailabilities({
    account,
    practitioners: inputPractitioners,
    startDate,
    endDate,
  });

  if (!practitioners.length) {
    throw StatusError(StatusError.BAD_REQUEST, 'Cannot find the specified practitioner');
  }

  const days = getRangeOfDays(startDate, endDate, timezone);
  return practitioners.reduce(async (result, practitioner) => {
    const { dailySchedules, timeOffs, isCustomSchedule, weeklyScheduleId, id } = practitioner;
    const weeklySchedule = isCustomSchedule ?
      await findWeeklyScheduleById(weeklyScheduleId) : officeHours;

    const finalDailySchedule = computeOpeningsForPractitioner({
      account,
      weeklySchedule,
      timeOffs,
      dailySchedules,
      appointments: practitioner.appointments,
      requests: practitioner.requests,
      startDate,
      endDate,
    });

    return days.reduce((acc, day) => ({
      ...acc,
      [day]: {
        ...acc[day],
        [id]: {
          ...finalDailySchedule[day].dailySchedule,
          fillers: finalDailySchedule[day].fillers,
          openings: finalDailySchedule[day].openings,
        },
      },
    }), result);
  }, {});
}

export async function findWeeklyScheduleById(weeklyScheduleId) {
  return WeeklySchedule.findOne({
    attributes: [
      'startDate',
      'pmsId',
      'isAdvanced',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    where: { id: weeklyScheduleId },
    raw: true,
  });
}
