const recurringTimeOffRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const TimeOff = require('../../../models/PractitionerRecurringTimeOff');

recurringTimeOffRouter.param('timeOffId', loaders('recurringTimeOff', 'PractitionerRecurringTimeOff'));

/**
 * Get all practitioner time offs under a clinic
 */
recurringTimeOffRouter.get('/', checkPermissions('timeOffs:read'), (req, res, next) => {

  // There is no joinData for timeoffs
  return TimeOff.run()
    .then(timeOffs => res.send(normalize('practitionerRecurringTimeOffs', timeOffs)))
    .catch(next);
});


/**
 * Create a timeOff
 */
recurringTimeOffRouter.post('/', checkPermissions('timeOffs:create'), (req, res, next) => {
  return TimeOff.save(req.body)
    .then((tf) => {
      return res.status(201).send(normalize('practitionerRecurringTimeOff', tf))
    })
    .catch(next);
});


/**
 * Update a timeOff
 */
recurringTimeOffRouter.put('/:timeOffId', checkPermissions('timeOffs:update'), (req, res, next) =>{
  return req.recurringTimeOff.merge(req.body).save()
    .then(tf => res.send(normalize('practitionerRecurringTimeOff', tf)))
    .catch(next);
});

/**
 * Delete a timeOff
 */
recurringTimeOffRouter.delete('/:timeOffId', checkPermissions('timeOffs:delete'), (req, res, next) => {
  req.recurringTimeOff.delete()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = recurringTimeOffRouter;
