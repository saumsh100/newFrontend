import { Router } from 'express';
import { ConnectorVersion } from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';
import format from '../../util/format';
const S3 = require('aws-sdk/clients/s3');

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
        format(req, res, 'connectorVersion', connectorVersion.get({ plain: true })),
      ),
    )
    .catch(next);
});


/**
 * Create a new release
 */
connectorRouter.get('/download', (req, res, next) => {
  ConnectorVersion.findOne({ order: [['createdAt', 'DESC']] })
    .then((release) => {
      if (!release) {
        return res.sendStatus(404);
      }

      const fileKey = release.path ? `${release.path}/${release.filename}` : release.filename;

      try {
        const s3 = new S3({
          credentials: {
            accessKeyId: release.key,
            secretAccessKey: release.secret,
          },
        });

        const url = s3.getSignedUrl('getObject', {
          Bucket: release.bucket,
          Key: fileKey,
          Expires: 60 * 5,
        });

        console.log(req.accountId, url);

        return res.send(url);
      } catch (e) {
        next(e);
      }
    })
    .catch(next);
});


module.exports = connectorRouter;
