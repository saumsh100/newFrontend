
const permissionsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Invite = require('../../../models/Invite');
const Reminder = require('../../../models/Reminder');
const Recall = require('../../../models/Recall');
const User = require('../../../models/User');
const StatusError = require('../../../util/StatusError');
const { Account, Permission } = require('../../../models');
const uuid = require('uuid').v4;

permissionsRouter.param('accountId', loaders('account', 'Account', { enterprise: true }));
permissionsRouter.param('inviteId', loaders('invite', 'Invite'));
permissionsRouter.param('permissionId', loaders('permission', 'Permission'));
permissionsRouter.param('reminderId', loaders('reminder', 'Reminder'));
permissionsRouter.param('recallId', loaders('recall', 'Recall'));

/**
 * PUT /:accountId/permissions/:permissionId
 *
 * - permission
 *
 */
permissionsRouter.put('/:accountId/permissions/:permissionId', (req, res, next) => {
  const { permission } = req;

  return User.get(req.sessionData.userId)
    .getJoin({ permission: true })
    .then((user) => {
      if (user.permission.role !== req.role) {
        return next(StatusError(403, 'Access Denied!'));
      }

      if (req.account.id !== req.accountId) {
        return next(StatusError(403, 'req.accountId does not match URL account id'));
      }

      if (req.role !== 'SUPERADMIN' && req.role !== 'OWNER') {
        return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
      }

      return permission.merge(req.body).save()
        .then(p => res.send(normalize('permission', p)))
        .catch(next);

    }).catch(next);
});

module.exports = permissionsRouter;

