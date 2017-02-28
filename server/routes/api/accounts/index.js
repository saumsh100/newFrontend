const accountsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Account = require('../../../models/Account');

accountsRouter.param('accountId', loaders('account', 'Account'));

accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  const { accountId } = req;

  if(req.params.accountId === accountId) {
    return Promise.resolve(req.account)
    .then(account => res.send(normalize('account', account)))
    .catch(next);
  }
  res.send(404);
});


accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.merge(req.body).save()
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});

module.exports = accountsRouter;

