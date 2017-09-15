
import { Router } from 'express';
import checkIsArray from '../../../middleware/checkIsArray';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import batchCreate from '../../util/batch';
import format from '../../util/format';
import normalize from '../normalize';
import { Family } from '../../../_models';

const familiesRouter = Router();

familiesRouter.param('familyId', sequelizeLoader('family', 'Family'));

/**
 * Get all patients of the same family
 */
familiesRouter.get('/:familyId', checkPermissions('family:read'), (req, res, next) => {
  return Promise.resolve(req.family)
    .then(family => res.send(format(req, res, 'family', family.get({ plain: true }))))
    .catch(next);
});

/**
 * Get all family info in a given account.
 */
familiesRouter.get('/', checkPermissions('family:read'), async (req, res, next) => {
  const { accountId } = req;
  try {
    const families = await Family.findAll({
      raw: true,
      where: { accountId },
    });

    res.send(format(req, res, 'families', families));
  } catch (error) {
    next(error);
  }
});

/**
 * Batch create family for connector
 */
familiesRouter.post('/connector/batch', checkPermissions('family:create'), (req, res, next) => {
  const families = req.body;
  const cleanedFamilies = families.map(family => Object.assign(
    {},
    family,
    { accountId: req.accountId }
  ));

  return batchCreate(cleanedFamilies, Family, 'family')
    .then(a => a.map(f => f.get({ plain: true })))
    .then(a => res.send(format(req, res, 'families', a)))
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'families', docs);
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Batch create family
 */
familiesRouter.post('/batch', checkPermissions('family:create'), checkIsArray('families'), (req, res, next) => {
  const { families } = req.body;
  const cleanedFamilies = families.map((family) => Object.assign(
    {},
    family,
    { accountId: req.accountId }
  ));

  return Family.batchSave(cleanedFamilies)
    .then(a => a.map(f => f.get({ plain: true })))
    .then(a => res.send(normalize('families', a)))
    .catch((err) => {
      let { errors, docs } = err;
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

      const entities = normalize('families', docs.map(f => f.get({ plain: true })));
      const responseData = Object.assign({}, entities, { errors });
      return res.status(400).send(responseData);
    })
    .catch(next);
});


/**
 * Create an family entry
 */
familiesRouter.post('/', checkPermissions('family:create'), (req, res, next) => {
  const familyData = Object.assign({}, { accountId: req.accountId }, req.body);
  return Family.create(familyData)
    .then(family => res.status(201).send(format(req, res, 'family', family.get({ plain: true }))))
    .catch(next);
});

/**
 * Update a family entry
 */
familiesRouter.put('/:familyId', checkPermissions('family:read'), (req, res, next) => {
  return req.family.update(req.body)
    .then(family => res.send(format(req, res, 'family', family.get({ plain: true }))))
    .catch(next);
});

/**
 * Delete a family entry
 */
familiesRouter.delete('/:familyId', checkPermissions('family:delete'), (req, res, next) => {
  return req.family.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = familiesRouter;
