
import { Router } from 'express';
import { UserAuth } from '../../lib/auth';
import loadPermissions from '../../lib/permissions';

const authRouter = Router();

authRouter.delete('/session/:sessionId', ({ params: { sessionId } }, res, next) =>
  UserAuth.logout(sessionId)
    .then(() => res.send(200))
    .catch(next)
);

authRouter.post('/', ({ body: { username, password } }, res, next) =>
  UserAuth.login(username, password)
    .then(({ model: user, token }) =>
    // TODO: add AuthToken creation after loading Permissions?
      loadPermissions(user)
        .then(permissions =>
          token.merge({
            ...permissions,
            accountId: user.activeAccountId,
            enterpriseId: user.enterpriseId,
          }).save()
        )
        // TODO: Session model should match client token
        .then(() => UserAuth.signToken({
          userId: user.id,
          tokenId: token.id,
          activeAccountId: user.activeAccountId,
        }))
    )
    .then(token => res.json({ token }))
    .catch(err => next(err))
);

module.exports = authRouter;
