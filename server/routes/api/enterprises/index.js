import { Router } from 'express';
import { pick } from 'lodash';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Enterprise, Account } from '../../../models';
import loaders from '../../util/loaders';

const router = Router();

router.param('enterpriseId', loaders('enterprise', 'Enterprise'));

router.get('/', checkPermissions('enterprises:read'), (req, res, next) => {
  Enterprise.run()
    .then(enterprises => res.send(normalize('enterprises', enterprises)))
    .catch(next);
});

router.post('/', checkPermissions('enterprises:create'), (req, res, next) => {
  Enterprise.save(pick(req.body, ['name']))
    .then(enterprise => res.send(201, normalize('enterprise', enterprise)))
    .catch(next);
});

router.put('/:enterpriseId', checkPermissions('enterprises:update'), (req, res, next) => {
  req.enterprise.merge(pick(req.body, ['name'])).save()
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

export default router;
