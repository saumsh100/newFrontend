import { Router } from 'express';
import { UserAuth, error } from '../../lib/auth';
import { Invite, Permission } from '../../models';
import StatusError from '../../util/StatusError';

const signupRouter = Router();

signupRouter.post('/:token', ({ body, params: { token } }, res, next) => {
  // Get user by the unique username
  const newUser = body;

  if (newUser.confirmPassword !== newUser.password) {
    return next(StatusError(400, 'Passwords Do Not Match!'));
  }

  if (!newUser.username || !newUser.password || !newUser.lastName || !newUser.firstName) {
    return next(StatusError(400, 'Please  Fill in all Values'));
  }

  return Invite.filter({ token }).run()
    .then(([invite]) => invite || error(401, 'Bad invite'))
    .then(({ accountId, id }) =>
      UserAuth.signup({ ...newUser, activeAccountId: accountId })
        .then(user => ({ user, inviteId: id }))
    )
    .then(({ user: { id, activeAccountId }, inviteId }) =>
      Promise.all([
        // Create permissions for new user
        Permission.save({
          userId: id,
          accountId: activeAccountId,
          role: 'VIEWER',
          permissions: {},
        }),

        Invite.get(inviteId).then(invite => invite.delete()),
      ])
    )
    .then(() => res.send(200))
    .catch(next);
});

module.exports = signupRouter;
