
import { DailySchedule, WeeklySchedule } from 'CareCruModels';
import StatusError from '../../../util/StatusError';
import { dailyScheduleNameList } from '../../../_models/WeeklySchedule';

/**
 * Get the list of pairs where the key is the name of the DailySchedule
 * and the value is the DailySchedule Object.
 * If the value of any pair is null, this pair is excluded from the result list.
 * @param weeklySchedule
 * @returns {*[][]}
 */
function getDayScheduleValuePairs(weeklySchedule) {
  return Object.entries(weeklySchedule.get({ plain: true }))
    .filter(([key, value]) => (dailyScheduleNameList[key] && value));
}

export async function createOfficeHour({ account, rawOfficeHour }) {
  const { weeklyScheduleId, id: accountId } = account;
  if (weeklyScheduleId) {
    throw StatusError(StatusError.CONFLICT, `Account ${accountId} already have office hour`);
  }

  // Add accountId to each DailySchedules
  const officeHourData = Object.entries(rawOfficeHour)
    .reduce((acc, [key, value]) => {
      if (dailyScheduleNameList[key] && value) {
        acc[key] = {
          ...acc[key],
          accountId,
        };
      }
      return acc;
    }, rawOfficeHour);

  try {
    const weeklySchedule = await WeeklySchedule.create(
      {
        ...officeHourData,
        accountId,
      },
      { include: Object.keys(dailyScheduleNameList).map(day => ({ association: day })) },
    );

    await account.update({ weeklyScheduleId: weeklySchedule.get('id') });
    return weeklySchedule;
  } catch (e) {
    console.error(e);
    console.error('Error occurs when creating office hour');
    throw e;
  }
}

export async function modifyOfficeHour({ weeklyScheduleId, accountId, rawOfficeHour }) {
  if (!weeklyScheduleId) {
    throw new StatusError(StatusError.NOT_FOUND, `Account ${accountId} does not have office hour`);
  }

  try {
    const weeklySchedule = await WeeklySchedule.findByPk(weeklyScheduleId);
    await Promise.all(getDayScheduleValuePairs(weeklySchedule)
      .map(([key, { id }]) => DailySchedule.update(rawOfficeHour[key], { where: { id } })));
    return weeklySchedule.update(rawOfficeHour);
  } catch (e) {
    console.error('Failed to modify the office hour');
    console.error(e);
    throw e;
  }
}

export async function deleteOfficeHour(account) {
  const { weeklyScheduleId, id: accountId } = account;
  if (!weeklyScheduleId) {
    throw new StatusError(StatusError.NOT_FOUND, `Account ${accountId} does not have office hour`);
  }

  try {
    const weeklySchedule = await WeeklySchedule.findByPk(weeklyScheduleId);
    const ids = getDayScheduleValuePairs(weeklySchedule).map(([, { id }]) => id);

    await Promise.all([
      DailySchedule.destroy({ where: { id: ids } }),
      account.update({ weeklyScheduleId: null }),
      WeeklySchedule.destroy({ where: { id: weeklyScheduleId } }),
    ]);
  } catch (e) {
    console.error('Failed to delete the office hour');
    console.error(e);
    throw e;
  }
}
