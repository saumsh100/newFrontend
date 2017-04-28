
const accountsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Permission = require('../../../models/Permission');
const Invite = require('../../../models/Invite');
const StatusError = require('../../../util/StatusError');
const Account = require('../../../models/Account');
const uuid = require('uuid').v4;


accountsRouter.param('accountId', loaders('account', 'Account'));
accountsRouter.param('id', loaders('invite', 'Invite'));


accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const {
    joinObject,
  } = req;

  /*// Some default code to ensure we don't pull the entire conversation for each chat
  if (joinObject.weeklySchedule) {
    joinObject.weeklySchedule = {
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
  }*/

  return Account.get(req.account.id).getJoin(joinObject)
    .then(account => res.send(normalize('account', account)))
    .catch(next);
});

accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.merge(req.body).save()
    .then(account => {res.send(normalize('account', account))})
    .catch(next);
});

accountsRouter.get('/:accountId/invites', (req, res, next) => {
  console.log(req.account.id);

  return Invite.filter({ accountId: req.account.id }).getJoin({}).run()
    .then((invites) => {
      res.send(normalize('invites', invites));
    })
    .catch(next);
});

accountsRouter.post('/:accountId/invites', (req, res, next) => {
  console.log(req.account.id);
  const newInvite = req.body;

  newInvite.token = uuid();

  return Invite.save(newInvite)
    .then((invites) => {
      console.log(invites)
      res.send(normalize('invites', [invites]));
    })
    .catch(next);

});


accountsRouter.delete('/:accountId/invites/:id', (req, res, next) => {
  console.log(req.invite.id);

  return Invite.get(req.invite.id)
    .then((invite) => {
      invite.delete().then((result) => {
        res.send(204);
      })
    })
    .catch(next);
});


accountsRouter.get('/:accountId/users', (req, res, next) => {
  console.log(req.account.id);

  return Permission.filter({ accountId: req.account.id }).getJoin({ users: true }).run()
    .then((permissions) => {
      const noPassword = permissions.map((permission) => {
        delete permission.users[0].password;
        return permission;
      });
      const obj = normalize('permissions', noPassword);
      obj.entities.accounts = {
        [req.account.id]: req.account,
      };
      res.send(obj);
    })
    .catch(next);
});

module.exports = accountsRouter;

