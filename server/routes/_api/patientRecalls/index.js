
import { Router } from 'express';
import isArray from 'lodash/isArray';
import { PatientRecall } from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import batchCreate, { batchUpdate } from '../../util/batch';
import format from '../../util/format';

const patientRecallsRouter = new Router();

patientRecallsRouter.param('patientRecallId', sequelizeLoader('patientRecall', 'PatientRecall'));

/**
 * Batch create patientRecalls
 */
patientRecallsRouter.post('/connector/batch', checkPermissions('patientRecalls:create'), (req, res, next) => {
  const patientRecalls = req.body;
  const cleanedPatientRecalls = patientRecalls.map(patientRecall => Object.assign(
    {},
    patientRecall,
    { accountId: req.accountId }
  ));

  return batchCreate(cleanedPatientRecalls, PatientRecall, 'patientRecall')
    .then(prs => prs.map(pr => pr.get({ plain: true })))
    .then((prs) => {
      const prIds = prs.map(app => app.id);
      const pub = req.app.get('pub');
      pub && pub.publish('PATIENTRECALL:CREATED:BATCH', JSON.stringify(prIds));

      return res.status(201).send(format(req, res, 'patientRecalls', prs));
    })
    .catch((err) => {
      let { errors, docs } = err;
      if (!isArray(errors) || !isArray(docs)) {
        throw err;
      }

      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const prIds = docs.map(app => app.id);
      const pub = req.app.get('pub');
      pub && pub.publish('PATIENTRECALL:CREATED:BATCH', JSON.stringify(prIds));

      const data = format(req, res, 'patientRecalls', docs);
      return res.status(201).send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Batch update patientRecalls
 */
patientRecallsRouter.put('/connector/batch', checkPermissions('patientRecalls:update'), (req, res, next) => {
  const patientRecalls = req.body;
  return batchUpdate(patientRecalls, PatientRecall, 'PatientRecall')
    .then(prs => prs.map(pr => pr.get({ plain: true })))
    .then((prs) => {
      const prIds = prs.map(app => app.id);
      const pub = req.app.get('pub');
      pub && pub.publish('PATIENTRECALL:CREATED:BATCH', JSON.stringify(prIds));

      return res.status(201).send(format(req, res, 'patientRecalls', prs));
    })
    .catch(({ errors, docs }) => {
      docs = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const prIds = docs.map(app => app.id);
      const pub = req.app.get('pub');
      pub && pub.publish('PATIENTRECALL:CREATED:BATCH', JSON.stringify(prIds));

      const data = format(req, res, 'patientRecalls', docs);
      return res.send(Object.assign({}, data));
    })
    .catch(next);
});

/**
 * Delete a patientRecall entry
 */
patientRecallsRouter.delete('/:patientRecallId', checkPermissions('patientRecalls:delete'), (req, res, next) => {
  return req.patientRecall.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

export default patientRecallsRouter;
