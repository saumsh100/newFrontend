
import { Router } from 'express';
import omit from 'lodash/omit';
import { UserAuth } from '../../lib/_auth';
import { loadPermissionsSequelize } from '../../lib/permissions';
import { User } from '../../_models';

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

authRouter.post('/resetpassword', ({ body: { email } }, res, next) => {

  User.findOne({ where: { username: email  } })
    .then((user) => {
      console.log(user);
      //res.send({ exists: !!user });
    })
    .catch(next);

  //res.status(200).send({email})
  //return email;
});

module.exports = authRouter;
