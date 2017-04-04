const timeOffRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const TimeOff = require('../../../models/PractitionerTimeOff');

/* practitionerTimeOff.param('practitionerTimeOffId',
                        loaders('practitionerTimeOff', 'PractitionerTimeOff'));
*/

/**
 * Get all practitioner time offs under a clinic
 */
timeOffRouter.get('/', checkPermissions('timeOffs:read'), (req, res, next) => {
  const { accountId } = req;

  // There is no joinData for timeoffs, no need to put...
  return TimeOff.run()
    .then(timeoffs => res.send(normalize('practitionerTimeOffs', timeoffs)))
    .catch(next);
});

module.exports = timeOffRouter;
