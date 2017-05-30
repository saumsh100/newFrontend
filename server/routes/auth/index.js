import { Router } from 'express';
import { pick } from 'lodash';
import { UserAuth } from '../../lib/auth';
import { Permission } from '../../models';
import StatusError from '../../util/StatusError';

const authRouter = Router();
const getEmailDomain = email => (([, domain]) => domain)(/@(.+)$/.exec(email));
const isCarecruEmail = email => getEmailDomain(email) === 'carecru.com';

authRouter.post('/', ({ body: { username, password } }, res, next) => {
  // TODO: we could load permissions with joins
  const loadPermissions = userId =>
    Permission.filter({ userId }).run()
      .then(([permission]) => permission || StatusError(500, 'User has no account permissions'));

  return UserAuth.login(username, password)
    .then(user => loadPermissions(user.id)
      // Prepare token
      .then(({ role, permissions = {} }) => ({
        role: isCarecruEmail(username) ? 'SUPERADMIN' : role,
        permissions,
        userId: user.id,
        ...(pick(user, ['activeAccountId', 'firstName', 'lastName', 'username'])),
      }))
    )
    .then(tokenData => UserAuth.signToken(tokenData))
    .then(token => res.json({ token }))
    .catch(err => next(err));
});

module.exports = authRouter;
