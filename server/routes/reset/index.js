
import { Router } from 'express';
import { UserAuth, error } from '../../lib/_auth';
import { User, PasswordReset } from '../../_models';
import StatusError from '../../util/StatusError';

const resetRouter = Router();

resetRouter.post('/:token', ({ body, params: { token } }, res, next) => {
  // Get user by the unique username
  const passwordChange = body;

  if (passwordChange.confirmPassword !== passwordChange.password) {
    return next(StatusError(400, 'Passwords Do Not Match!'));
  }


  return PasswordReset.findOne({
    where: {
      token,
    },
  }).then((reset) => {
    if (!reset) {
      return res.send(400);
    }
    const username = reset.dataValues.email;

    return User.findOne({
      where: {
        username,
      },
    }).then(async (user) => {
      await user.setPasswordAsync(passwordChange.password);
      await user.save();
      await reset.destroy();
      return res.send(200);
    });
  }).catch(next);
});

module.exports = resetRouter;
