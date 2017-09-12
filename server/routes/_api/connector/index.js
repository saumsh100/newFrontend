import { Router } from 'express';
import { ConnectorVersion } from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';
import format from '../../util/format';

const connectorRouter = new Router();


/**
 * Get the latest connector release info.
 */
connectorRouter.get('/release', checkPermissions('connectorVersion:read'), (req, res, next) => {
  ConnectorVersion.findOne({ order: [['createdAt', 'DESC']] })
    .then(release => res.send(format(req, res, 'connectorVersion', release.get({ plain: true }))))
    .catch(next);
});

/**
 * Create a new release
 */
connectorRouter.post('/', checkPermissions('connectorVersion:create'), (req, res, next) => {
  return ConnectorVersion.create(req.body)
    .then(
      connectorVersion => res.status(201).send(
        format(req, res, 'connectorVersion', connectorVersion.get({ plain: true }))
      )
    )
    .catch(next);
});


module.exports = connectorRouter;
