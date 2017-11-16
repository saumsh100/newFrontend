/**
 * Created by gavin on 2017-11-03.
 */
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import batchCreate from '../../util/batch';
import jsonapi from '../../util/jsonapi';
import { Correspondence } from '../../../_models';
import handleSequelizeError from '../../util/handleSequelizeError';


const correspondencesRouter = Router();

correspondencesRouter.param(
  'accountId',
  sequelizeLoader('account', 'Account')
);

correspondencesRouter.param(
  'correspondenceId',
  sequelizeLoader('correspondence', 'Correspondence')
);

/**
 * Get all Correspondences under a clinic
 */
correspondencesRouter.get('/', (req, res, next) => {
  const {
    accountId,
    includeArray,
  } = req;

  return Correspondence.findAll({
    where: { accountId },
    include: includeArray,
  })
  .then((correspondences) => {
    correspondences = correspondences.map(correspondence => correspondence.get({ plain: true }));

    return res.send(jsonapi('correspondence', correspondences));
  }).catch(next);
});

/**
 * Create Correspondences - Connector
 */
correspondencesRouter.post('/connector/batch', checkPermissions('correspondences:create'), async (req, res, next) => {
  const correspondences = req.body;
  const cleanedCorrespondences = correspondences.map(correspondence => Object.assign(
    {},
    correspondence,
    {
      accountId: req.accountId,
      isSyncedWithPms: true,
    }
  ));

  return batchCreate(cleanedCorrespondences, Correspondence, 'Correspondence')
    .then((correspondencesCreated) => {
      const correspondenceData = correspondencesCreated.map(
        correspondence => correspondence.get({ plain: true }
      ));
      res.status(201).send(jsonapi('correspondence', correspondenceData));
    })
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = jsonapi('correspondence', docs);
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * return changed Correspondences to connector via isSyncedWithPms
 */
correspondencesRouter.get('/connector/notSynced', checkPermissions('correspondences:read'), async (req, res, next) => {
  const { accountId } = req;

  let correspondences;
  try {
    correspondences = await Correspondence.findAll({
      raw: true,
      where: {
        accountId,
        isSyncedWithPms: false,
      },
    });
    return res.send(jsonapi('correspondence', correspondences));
  } catch (error) {
    return next(error);
  }
});


/**
 * Update Correspondences - Connector
 */
correspondencesRouter.put('/connector/batch', checkPermissions('correspondences:update'), (req, res, next) => {
  const correspondences = req.body;
  const correspondencesUpdates = correspondences.map(correspondence =>
    Correspondence.findById(correspondence.id)
      .then(existingCorrespondence => existingCorrespondence.update(correspondence)));

  return Promise.all(correspondencesUpdates)
    .then((existingCorrespondences) => {
      const correspondenceData = existingCorrespondences.map(
        correspondence => correspondence.get({ plain: true })
      );
      res.send(jsonapi('correspondence', correspondenceData));
    })
    .catch(next);
});

/**
 * Delete a Correspondence
 */
correspondencesRouter.delete('/:correspondenceId', checkPermissions('correspondences:delete'), (req, res, next) =>
  req.correspondence.destroy()
    .then(() => res.status(204).send())
    .catch(next));

module.exports = correspondencesRouter;
