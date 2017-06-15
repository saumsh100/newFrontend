
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
    .then(({ accountId, id, enterpriseId }) => {
      return Permission.save({
        role: 'MANAGER',
      }).then((permission) => {
        return UserAuth.signup({
          ...newUser,
          enterpriseId,
          permissionId: permission.id,
          activeAccountId: accountId,
        })
          .then(({ savedModel: user, authSession }) => {
            return {
            user,
            inviteId: id,
            sessionIdId: authSession.id,
          }});
      });
    })
    .then(({ user: { id, activeAccountId }, inviteId, sessionId }) => {
       return Invite.get(inviteId).then(invite => invite.delete())
        .then(() => UserAuth.signToken({ userId: id, sessionId }))
      }
    )
    .then(authToken => res.json({ token: authToken }))
    .catch(next);
});

module.exports = signupRouter;
