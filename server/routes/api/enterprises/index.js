import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
const Enterprise = require('../../../models/Enterprise');
const loaders = require('../../util/loaders');

const router = Router();

router.param('enterpriseId', loaders('enterprise', 'Enterprise'));

router.get('/', checkPermissions('enterprises:read'), (req, res, next) => {
  Enterprise.run()
    .then(enterprises => res.send(normalize('enterprises', enterprises)))
    .catch(next);
});

router.delete('/:enterpriseId', checkPermissions('enterprises:delete'), (req, res, next) => {
  req.enterprise.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});

export default router;
