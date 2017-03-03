
const accountsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const StatusError = require('../../../util/StatusError');
const Account = require('../../../models/Account');

accountsRouter.param('accountId', loaders('account', 'Account'));

accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const {
    joinObject,
  } = req;

  // Some default code to ensure we don't pull the entire conversation for each chat
  if (joinObject.officeHours) {
    joinObject.officeHours = {
      _apply: (sequence) => {
        return sequence
          .getJoin({
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          });
      },
    };
  }

  return Account.get(req.account.id).getJoin(joinObject)
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});

accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.merge(req.body).save()
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});

module.exports = accountsRouter;

