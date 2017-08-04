
import { Router } from 'express';
import { UserAuth, error } from '../../lib/_auth';
import { Invite, Permission } from '../../_models';
import StatusError from '../../util/StatusError';

const signupRouterSequelize = Router();

signupRouterSequelize.post('/:token', ({ body, params: { token } }, res, next) => {
  // Get user by the unique username
  console.log('asdsad')
  const newUser = body;
  console.log('asdsd')
  if (newUser.confirmPassword !== newUser.password) {
    return next(StatusError(400, 'Passwords Do Not Match!'));
  }

  if (!newUser.username || !newUser.password || !newUser.lastName || !newUser.firstName) {
    return next(StatusError(400, 'Please  Fill in all Values'));
  }
  console.log('asdsads')
  return Invite.findOne({ where: { token }, raw: true })
    .then(invite => invite || error(401, 'Bad invite'))
    .then(({ accountId, id, enterpriseId }) => {
      return Permission.create({
        role: 'MANAGER',
      }).then((permission) => {
        permission = permission.get({ plain: true });
        // console.log(permission)
        return UserAuth.signup({
          ...newUser,
          enterpriseId,
          permissionId: permission.id,
          activeAccountId: accountId,
        })
          .then(({ model: user, session }) => {
            return {
            user,
            sessionIdId: session.id,
          }});
      });
    })
    .then(({ user: { id, activeAccountId }, sessionId }) => {
      return Invite.destroy({ where: { token } });
    })
    .then(authToken => res.json({ token: authToken }))
    .catch(next);
});

module.exports = signupRouterSequelize;
