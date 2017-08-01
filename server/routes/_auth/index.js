
import { Router } from 'express';
import omit from 'lodash/omit';
import { UserAuth } from '../../lib/_auth';
import loadPermissions, { loadPermissionsSequelize } from '../../lib/permissions';

const authRouter = Router();

authRouter.post('/', ({ body: { username, password } }, res, next) =>
  UserAuth.login(username, password)
    .then(({ model: user, session }) =>
    // TODO: add AuthSession creation after loading Permissions?
      loadPermissionsSequelize(user)
        .then(({ dataValues }) => {
          const permission = dataValues;
          const permissionId = permission.id;
          delete permission.id;
          return session.update({
            ...permission,
            permissionId,
            accountId: user.activeAccountId,
            enterpriseId: user.enterpriseId,
          });
        })
        .then(() => UserAuth.signToken({
          userId: user.id,
          sessionId: session.id,
          activeAccountId: user.activeAccountId,
        }))
    )
    .then(token => res.json({ token }))
    .catch(err => next(err))
);

authRouter.delete('/session/:sessionId', ({ params: { sessionId } }, res, next) =>
  UserAuth.logout(sessionId)
    .then(() => res.send(200))
    .catch(next)
);

module.exports = authRouter;
