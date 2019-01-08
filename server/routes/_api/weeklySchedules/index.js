
import { WeeklySchedule, DailySchedule } from 'CareCruModels';
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import {
  dailyScheduleNameList,
  generateDefaultDailySchedules,
  updateDaySchedules,
} from '../../../_models/WeeklySchedule';

const weeklySchedulesRouter = Router();

weeklySchedulesRouter.param('weeklyScheduleId', sequelizeLoader('weeklySchedule', 'WeeklySchedule'));

/**
 * Create a weeklySchedule
 * Also creates seven daily schedule represented from monday to sunday.
 * If daily schedule is not provided, a default daily schedule will be created.
 */
weeklySchedulesRouter.post('/', checkPermissions('weeklySchedules:create'), async ({ body, accountId }, res, next) => {
  const { practitionerId } = body;
  // Attach weeklySchedule to the clinic of posting user
  const defaultWeeklySchedule = {
    ...generateDefaultDailySchedules({
      practitionerId,
      accountId,
    }),
    ...body,
    accountId,
  };
  // Add accountId and practitionerId to dailySchedule if exists
  const weeklyScheduleData = Object.entries(defaultWeeklySchedule)
    .reduce((acc, [key, value]) => {
      if (dailyScheduleNameList[key] && value) {
        acc[key] = {
          ...acc[key],
          accountId,
          practitionerId,
        };
      }
      return acc;
    }, defaultWeeklySchedule);

  try {
    const createdWeeklySchedule = await WeeklySchedule.create(
      weeklyScheduleData,
      {
        include: Object.keys(dailyScheduleNameList)
          .map(day => ({ association: day })),
      },
    );

    res.status(201).send(normalize('weeklySchedule', createdWeeklySchedule.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/**
 * Update a weeklySchedule
 */
weeklySchedulesRouter.put('/:weeklyScheduleId', checkPermissions('weeklySchedules:update'), async ({ weeklySchedule, body }, res, next) => {
  // TODO: check if weeklyschedule accountid matches req.accountid
  try {
    await updateDaySchedules(weeklySchedule, body, DailySchedule);
    await weeklySchedule.update(body);
    // Cannot directly use the return value from .update
    // since the body does not necessarily include all the daily schedule information
    const updatedWeeklySchedule = await WeeklySchedule.findByPk(weeklySchedule.id);
    res.send(normalize('weeklySchedule', updatedWeeklySchedule.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

module.exports = weeklySchedulesRouter;
