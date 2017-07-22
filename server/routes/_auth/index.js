
import { Router } from 'express';
import omit from 'lodash/omit';
import { UserAuth } from '../../lib/auth';
import loadPermissions, { loadPermissionsSequelize } from '../../lib/permissions';

const authRouter = Router();

authRouter.post('/', ({ body: { username, password } }, res, next) =>
  UserAuth.login(username, password)
    .then(({ model: user, session }) =>
    // TODO: add AuthSession creation after loading Permissions?
      loadPermissionsSequelize(user)
        .then(({ dataValues }) => {
          const permission = dataValues;
          delete permission.id;
          return session.update({
            ...permission,
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
