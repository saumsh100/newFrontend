const timeOffRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const TimeOff = require('../../../models/PractitionerTimeOff');

timeOffRouter.param('timeOffId', loaders('timeOff', 'PractitionerTimeOff'));


/**
 * Get all practitioner time offs under a clinic
 */
timeOffRouter.get('/', checkPermissions('timeOffs:read'), (req, res, next) => {

  // There is no joinData for timeoffs
  return TimeOff.run()
    .then(timeOffs => res.send(normalize('practitionerTimeOffs', timeOffs)))
    .catch(next);
});


/**
 * Create a timeOff
 */
timeOffRouter.post('/', checkPermissions('timeOffs:create'), (req, res, next) => {
  return TimeOff.save(req.body)
    .then(tf => res.status(201).send(normalize('practitionerTimeOff', tf)))
    .catch(next);
});


/**
 * Update a timeOff
 */
timeOffRouter.put('/:timeOffId', checkPermissions('timeOffs:update'), (req, res, next) =>{
  return req.timeOff.merge(req.body).save()
    .then(tf => res.send(normalize('practitionerTimeOff', tf)))
    .catch(next);
});

/**
 * Delete a timeOff
 */
timeOffRouter.delete('/:timeOffId', checkPermissions('timeOffs:delete'), (req, res, next) => {
  req.timeOff.delete()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = timeOffRouter;
