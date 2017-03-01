
const accountsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const StatusError = require('../../../util/StatusError');
const Account = require('../../../models/Account');

accountsRouter.param('accountId', loaders('account', 'Account'));

accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(404, 'req.accountId does not match URL account id'));
  }

  return Promise.resolve(req.account)
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});


accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.merge(req.body).save()
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});

module.exports = accountsRouter;

