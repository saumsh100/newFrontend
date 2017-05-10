const familyRouter = require('express').Router();
const Family = require('../../../models/Family');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');

familyRouter.param('familyId', loaders('family', 'Family'));

/**
 * Get all patients of the same family
 */
familyRouter.get('/:familyId', checkPermissions('family:read'), (req, res, next) => {

  const {
    accountId,
    joinObject,
  } = req;

  return Family
    .filter({
      accountId,
    })
    .getJoin(joinObject)
    .run()
    .then(familyMembers => res.send(normalize('families', familyMembers)))
    .catch(next);
});

module.exports = familyRouter;
