
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { sequelizeLoader } from '../../util/loaders';
import { Recall } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { getPatientsDueForRecall, mapPatientsToRecalls } from '../../../lib/recalls/helpers';

const recallsRouter = new Router();

recallsRouter.param('accountId', sequelizeLoader('account', 'Account'));
recallsRouter.param('recallId', sequelizeLoader('recall', 'Recall'));

/**
 * GET /:accountId/recalls
 */
recallsRouter.get('/:accountId/recalls', checkPermissions('accounts:read'), async (req, res, next) => {
  // TODO: these should be on a recalls endpoint, not nested on account
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  try {
    const recalls = await Recall.findAll({
      raw: true,
      where: { accountId: req.accountId },
    });

    res.send(normalize('recalls', recalls));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:accountId/recalls/stats
 */
recallsRouter.get('/:accountId/recalls/stats', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    // TODO: date needs to be on the 30 minute marks
    const date = (new Date()).toISOString();
    const recalls = await Recall.findAll({
      raw: true,
      where: { accountId: req.accountId },
      order: [['lengthSeconds', 'DESC']],
    });

    const data = [];
    for (const recall of recalls) {
      const patients = await getPatientsDueForRecall({ account: req.account, recall, date });
      const noEmail = patients.filter(p => !p.email);
      data.push({
        ...recall,
        success: patients.length - noEmail.length,
        fail: noEmail.length,
      });
    }

    res.send(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:accountId/recalls/list
 */
recallsRouter.get('/:accountId/recalls/list', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    // TODO: date needs to be on the 30 minute marks
    const { accountId } = req;
    const date = (new Date()).toISOString();
    const recalls = await Recall.findAll({
      raw: true,
      where: { accountId },
      order: [['lengthSeconds', 'DESC']],
    });

    const data = await mapPatientsToRecalls({ recalls, account: { id: accountId }, date });
    res.send(data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /:accountId/recalls
 */
recallsRouter.post('/:accountId/recalls', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const saveRecall = Object.assign({ accountId: req.accountId }, req.body);
  Recall.create(saveRecall)
    .then((recall) => {
      res.status(201).send(normalize('recall', recall.dataValues));
    })
    .catch(next);
});

/**
 * PUT /:accountId/recalls/:recallId
 */
recallsRouter.put('/:accountId/recalls/:recallId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  return req.recall.update(req.body)
    .then((recall) => {
      res.send(normalize('recall', recall.dataValues));
    })
    .catch(next);
});

recallsRouter.delete('/:accountId/recalls/:recallId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }
  return req.recall.destroy()
    .then(() => res.status(204).send())
    .catch(next);
});

module.exports = recallsRouter;

