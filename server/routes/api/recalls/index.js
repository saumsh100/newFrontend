
const recallsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Recall = require('../../../models/Recall');
const StatusError = require('../../../util/StatusError');
const uuid = require('uuid').v4;

recallsRouter.param('accountId', loaders('account', 'Account', { enterprise: true }));
recallsRouter.param('recallId', loaders('recall', 'Recall'));

/**
 * GET /:accountId/recalls
 */
recallsRouter.get('/:accountId/recalls', checkPermissions('accounts:read'), (req, res, next) => {
  // TODO: these should be on a recalls endpoint, not nested on account
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  return Recall.filter({ accountId: req.accountId })
    .run()
    .then((recalls) => {
      res.send(normalize('recalls', recalls));
    })
    .catch(next);
});

/**
 * POST /:accountId/recalls
 */
recallsRouter.post('/:accountId/recalls', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const saverecall = Object.assign({ accountId: req.accountId }, req.body);
  return Recall.save(saverecall)
    .then((recall) => {
      res.send(normalize('recall', recall));
    })
    .catch(next);
});

recallsRouter.put('/:accountId/recalls/:recallId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  return req.recall.merge(req.body).save()
  .then(recall => {
    res.send(normalize('recall', recall));
  })
  .catch(next);
});

recallsRouter.delete('/:accountId/recalls/:recallId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }
  return req.recall.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = recallsRouter;

