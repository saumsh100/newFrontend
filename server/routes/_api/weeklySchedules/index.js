
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { WeeklySchedule } from '../../../_models';

const weeklySchedulesRouter = Router();

weeklySchedulesRouter.param('weeklyScheduleId', sequelizeLoader('weeklySchedule', 'WeeklySchedule'));

/**
 * Create a weeklySchedule
 */
weeklySchedulesRouter.post('/', checkPermissions('weeklySchedules:create'), (req, res, next) => {
  // Attach weeklySchedule to the clinic of posting user
  const weeklyScheduleData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });

  return WeeklySchedule.create(weeklyScheduleData)
    .then(weeklySchedule => res.status(201).send(normalize('weeklySchedule', weeklySchedule.dataValues)))
    .catch(next);
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
weeklySchedulesRouter.put('/:weeklyScheduleId', checkPermissions('weeklySchedules:update'), (req, res, next) => {
  //TODO: check if weeklyschedule accountid matches req.accountid
  return req.weeklySchedule.update(req.body)
    .then(weeklySchedule => res.send(normalize('weeklySchedule', weeklySchedule.dataValues)))
    .catch(next);
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
