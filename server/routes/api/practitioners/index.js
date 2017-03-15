
const practitionersRouter = require('express').Router();
const authMiddleware = require('../../../middleware/auth');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const Practitioner = require('../../../models/Practitioner');
const WeeklySchedule = require('../../../models/WeeklySchedule');
const normalize = require('../normalize');

practitionersRouter.param('practitionerId', loaders('practitioner', 'Practitioner'));

/**
 * Get all practitioners under a clinic
 */
practitionersRouter.get('/', (req, res, next) => {

  //const accountId = req.query.accountId || req.accountId;
  const {
    accountId,
    joinObject,
  } = req;
  // const { accountId } = req;

  return Practitioner.filter({ accountId }).getJoin(joinObject).run()
    .then(practitioners => res.send(normalize('practitioners', practitioners)))
    .catch(next);
});

/**
 * Create a practitioner
 */
practitionersRouter.post('/', checkPermissions('practitioners:create'), (req, res, next) => {

  const weeklyScheduleData = Object.assign({}, { accountId: req.accountId });

  return WeeklySchedule.save(weeklyScheduleData)
    .then((weeklySchedule) => {
      const practitionerData = Object.assign({},
        { accountId: req.accountId,
          weeklyScheduleId: weeklySchedule.id,
        },
        req.body);

      Practitioner.save(practitionerData)
        .then(practitioner => {
          practitioner.weeklySchedule = weeklySchedule;
          res.status(201).send(normalize('practitioner', practitioner))
        })
        .catch(next);
    }).catch(next);

});

/**
 * Get a single practitioner
 */
practitionersRouter.get('/:practitionerId', checkPermissions('practitioners:read'), (req, res, next) => {
  return Promise.resolve(req.practitioner)
    .then(practitioner => res.send(normalize('practitioner', practitioner)))
    .catch(next);
});

/**
 * Update a practitioner
 */
practitionersRouter.put('/:practitionerId', checkPermissions('practitioners:update'), (req, res, next) => {
  return req.practitioner.merge(req.body).save()
    .then(practitioner => res.send(normalize('practitioner', practitioner)))
    .catch(next);
});

/**
 * Delete a practitioner
 */
practitionersRouter.delete('/:practitionerId', checkPermissions('practitioners:delete'), (req, res, next) => {
  return req.practitioner.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});



module.exports = practitionersRouter;
