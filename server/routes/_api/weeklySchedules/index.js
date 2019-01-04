
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
 * Get all weeklySchedules under a clinic
 */
/*weeklySchedulesRouter.get('/', checkPermissions('weeklySchedules:read'), (req, res, next) => {
  const { accountId } = req;
  // There is no joinData for weeklySchedule, no need to put...
  return WeeklySchedule.filter({ accountId }).run()
    .then((weeklySchedules) =>{
        res.send(normalize('weeklySchedules', weeklySchedules))
    }).catch(next);
});*/

/**
 * Get a weeklySchedule
 */
/*weeklySchedulesRouter.get('/:weeklyScheduleId', checkPermissions('weeklySchedules:read'), (req, res, next) => {
  return Promise.resolve(req.weeklySchedule)
    .then(weeklySchedule => res.send(normalize('weeklySchedule', weeklySchedule)))
    .catch(next);
});*/

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

/**
 * Delete a weeklySchedule
 */
/*weeklySchedulesRouter.delete('/:weeklyScheduleId', checkPermissions('weeklySchedules:delete'), (req, res, next) => {
  // We actually delete weeklySchedules as we don't care about history
  return req.weeklySchedule.delete()
    .then(() => res.send(204))
    .catch(next);
});*/

module.exports = weeklySchedulesRouter;
