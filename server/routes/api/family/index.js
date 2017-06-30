const _ = require('lodash');
const familyRouter = require('express').Router();
const Family = require('../../../models/Family');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const checkIsArray = require('../../../middleware/checkIsArray');

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
 * Batch create family
 */
familyRouter.post('/batch', checkPermissions('family:create'), checkIsArray('families'), (req, res, next) => {
  const { families } = req.body;
  const cleanedFamilies = families.map((family) => Object.assign(
    {},
    _.omit(family, ['id']),
    { accountId: req.accountId }
  ));

  return Family.batchSave(cleanedFamilies)
    .then(a => res.send(normalize('families', a)))
    .catch(({ errors, docs }) => {
      errors = errors.map(({ family, message }) => {
        // Created At can sometimes be a ReQL query and cannot
        // be stringified by express on res.send, this is a
        // quick fix for now. Also, message has to be plucked off
        // because it is removed on send as well
        delete family.createdAt;
        return {
          family,
          message,
        };
      });

      const entities = normalize('families', docs);
      const responseData = Object.assign({}, entities, { errors });
      return res.status(400).send(responseData);
    })
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
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = familyRouter;
