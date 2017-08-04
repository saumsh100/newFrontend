import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import { User } from '../../../_models';
import StatusError from '../../../util/StatusError';
import normalize from '../normalize';

const permissionsRouter = new Router();


permissionsRouter.param('accountId', sequelizeLoader('account', 'Account'));
permissionsRouter.param('permissionId', sequelizeLoader('permission', 'Permission'));

/**
 * PUT /:accountId/permissions/:permissionId
 *
 * - permission
 *
 */
permissionsRouter.put('/:accountId/permissions/:permissionId', (req, res, next) => {
  try {
    return User.findById(req.sessionData.userId, { include: ['permission'] })
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

        return req.permission.update(req.body)
          .then(permission => res.send(normalize('permission', permission.dataValues)))
          .catch(next);
      }).catch(next);
  } catch (error) {
    next(error);
  }
});

module.exports = permissionsRouter;
