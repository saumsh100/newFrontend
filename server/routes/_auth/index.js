
import { Router } from 'express';
import omit from 'lodash/omit';
import { UserAuth } from '../../lib/_auth';
import { loadPermissionsSequelize } from '../../lib/permissions';
import { User, PasswordReset } from '../../_models';
import { resetPasswordEmail } from '../../lib/resetPasswordEmail';

const uuid = require('uuid').v4;

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

authRouter.post('/resetpassword', (req, res, next) => {
  const {
    body,
  } = req;

  const email = body.email;
  const token = uuid();

  let protocol = req.protocol;

  // this is for heroku to create the right http link it uses
  // x-forward-proto for https but shows http in req.protocol

  if (req.headers['x-forwarded-proto'] === 'https') {
    protocol = 'https';
  }

  const fullUrl = `${protocol}://${req.get('host')}/reset/${token}`;

  User.findOne({ where: { username: email } })
    .then(async (user) => {
      if (!user) {
        return res.send(400);
      }

      await PasswordReset.create({
        email,
        token,
      });

      const mergeVars = [
        {
          name: 'RESET_URL',
          content: fullUrl,
        },
      ];

      resetPasswordEmail({
        subject: 'Reset Password',
        toEmail: email,
        mergeVars,
      }).catch(err => console.log(err));

      return res.sendStatus(201);
    })
    .catch(next);
});

module.exports = authRouter;
