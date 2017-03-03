
const weeklySchedulesRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const WeeklySchedule = require('../../../models/WeeklySchedule');

weeklySchedulesRouter.param('weeklyScheduleId', loaders('weeklySchedule', 'WeeklySchedule'));

/**
 * Create a weeklySchedule
 */
/*weeklySchedulesRouter.post('/', checkPermissions('weeklySchedules:create'), (req, res, next) => {
  // Attach weeklySchedule to the clinic of posting user
  const weeklyScheduleData = Object.assign({}, req.body, {
    accountId: req.accountId,
    name: req.body.name,
    pmsId: req.body.pmsId,
  });

  return WeeklySchedule.save(weeklyScheduleData)
    .then(weeklySchedule => res.send(201, normalize('weeklySchedule', weeklySchedule)))
    .catch(next);
});*/

/**
 * Get all weeklySchedules under a clinic
 */
/*weeklySchedulesRouter.get('/', checkPermissions('weeklySchedules:read'), (req, res, next) => {
  const { accountId } = req;

  // There is no joinData for weeklySchedule, no need to put...
  return WeeklySchedule.filter({ accountId }).run()
    .then(weeklySchedules => res.send(normalize('weeklySchedules', weeklySchedules)))
    .catch(next);
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
  return req.weeklySchedule.merge(req.body).save()
    .then(weeklySchedule => res.send(normalize('weeklySchedule', weeklySchedule)))
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
