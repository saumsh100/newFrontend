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
  console.log(accountId, joinObject, req.family.id);

  return Family
    .filter({
      accountId,
      id: req.family.id,
    })
    .getJoin(joinObject)
    .run()
    .then(familyMembers => res.send(normalize('families', familyMembers)))
    .catch(next);
});

/**
 * Get all family info in a given account.
 */
familyRouter.get('/', checkPermissions('family:read'), (req, res, next) => {
  const { accountId } = req;

  return Family
    .filter({ accountId })
    .run()
    .then(allFamilyInfo => res.send(normalize('families', allFamilyInfo)))
    .catch(next);
});

/**
 * Create an family entry
 */
familyRouter.post('/', checkPermissions('family:create'), (req, res, next) => {
  const familyData = Object.assign({}, { accountId: req.accountId }, req.body);
  return Family.save(familyData)
    .then(family => res.status(201).send(normalize('family', family)))
    .catch(next);
});

/**
 * Update a family entry
 */
familyRouter.put('/:familyId', checkPermissions('family:read'), (req, res, next) => {
  return req.family.merge(req.body).save()
    .then(family => res.send(normalize('family', family)))
    .catch(next);
});

/**
 * Delete a family entry
 */
familyRouter.delete('/:familyId', checkPermissions('family:delete'), (req, res, next) => {
  return req.family.delete()
    .then(() => res.status(204))
    .catch(next);
});

module.exports = familyRouter;
