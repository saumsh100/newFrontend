
import { Account, WeeklySchedule, DailySchedule } from 'CareCruModels';
import { getProperDateWithZone } from '@carecru/isomorphic';

/**
 * fetchAccountDailySchedules is an async function that will return the promised query
 * for an account's dailySchedules over a range
 *
 * @param accountId - UUID String
 * @param startDate - ISOString
 * @param endDate - ISOString
 * @param timezone - String (ie. 'America/Edmonton')
 * @return [DailySchedules]
 */
export function fetchAccountDailySchedules({ startDate, endDate, timezone, accountId }) {
  const startDateOnly = getProperDateWithZone(startDate, timezone);
  const endDateOnly = getProperDateWithZone(endDate, timezone);
  return DailySchedule.findAll({
    where: {
      accountId: accountId,
      practitionerId: null,
      date: { $between: [startDateOnly, endDateOnly] },
    },
  });
}

/**
 * fetchAccountWeeklySchedule is an async function that will fetch the account's
 * default weeklySchedule
 *
 * @param accountId - UUID String
 * @return {WeeklySchedule}
 */
export async function fetchAccountWeeklySchedule({ accountId }) {
  const account = await Account.findOne({
    where: { id: accountId },
    include: [{
      model: WeeklySchedule,
      as: 'weeklySchedule',
      include: [
        { association: 'monday' },
        { association: 'tuesday' },
        { association: 'wednesday' },
        { association: 'thursday' },
        { association: 'friday' },
        { association: 'saturday' },
        { association: 'sunday' },
      ],

      required: true,
    }],
  });

  // Return null if there's no account or
  // the account doesn't have a weeklySchedule
  return (account && account.weeklySchedule) || null;
}
