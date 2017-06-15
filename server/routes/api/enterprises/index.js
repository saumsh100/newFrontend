
import { Router } from 'express';
import { pick } from 'lodash';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Enterprise, Account, User } from '../../../models';
import loaders from '../../util/loaders';
import { UserAuth } from '../../../lib/auth';

const router = Router();

router.param('enterpriseId', loaders('enterprise', 'Enterprise'));
router.param('accountId', loaders('account', 'Account'));

router.get('/', checkPermissions('enterprises:read'), (req, res, next) => {
  Enterprise.run()
    .then(enterprises => res.send(normalize('enterprises', enterprises)))
    .catch(next);
});

router.post('/', checkPermissions('enterprises:create'), (req, res, next) => {
  Enterprise.save(pick(req.body, ['name', 'plan']))
    .then(enterprise => res.send(201, normalize('enterprise', enterprise)))
    .catch(next);
});

router.post('/switch', checkPermissions('enterprises:read'), (req, res, next) => {
  const { userId, body: { enterpriseId }, sessionData, sessionId } = req;
  Account.filter({ enterpriseId }).run()
    .then(([{ id: accountId }]) => {
      return User.get(userId).then((user) => {
        return user.merge({
          enterpriseId,
          activeAccountId: accountId,
        }).save();
      }).then(() => {
        return UserAuth.updateSession(sessionId, sessionData, { accountId, enterpriseId })
          .then(({ id: newSessionId }) => UserAuth.signToken({
            userId: sessionData.userId,
            sessionId: newSessionId,
            accountId,
          }));
      });
    })
    .then(token => res.json({ token }))
    .catch(next);
});

router.get('/:enterpriseId', checkPermissions('enterprises:read'), (req, res) => {
  res.send(normalize('enterprise', req.enterprise));
});

router.put('/:enterpriseId', checkPermissions('enterprises:update'), (req, res, next) => {
  req.enterprise.merge(pick(req.body, ['name', 'plan'])).save()
    .then(enterprise => res.send(normalize('enterprise', enterprise)))
    .catch(next);
});

router.delete('/:enterpriseId', checkPermissions('enterprises:delete'), (req, res, next) => {
  req.enterprise.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});

router.get('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:read']), (req, res, next) => {
  Account.filter({ enterpriseId: req.enterprise.id }).run()
    .then(accounts => res.send(normalize('accounts', accounts)))
    .catch(next);
});


router.post('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:update']), (req, res, next) => {
  const accountData = {
    ...pick(req.body, 'name'),
    enterpriseId: req.enterprise.id,
  };

  Account.save(accountData)
    .then(account => res.send(201, normalize('account', account)))
    .catch(next);
});

router.put(
  '/:enterpriseId/accounts/:accountId',
  checkPermissions(['enterprises:read', 'accounts:update']),
  (req, res, next) => {
    req.account.merge(pick(req.body, ['name'])).save()
      .then(account => res.send(normalize('account', account)))
      .catch(next);
  }
);

router.delete(
  '/:enterpriseId/accounts/:accountId',
  checkPermissions(['enterprises:read', 'accounts:delete']),
  (req, res, next) => {
    req.account.delete()
      .then(() => res.sendStatus(204))
      .catch(next);
  }
);

export default router;
