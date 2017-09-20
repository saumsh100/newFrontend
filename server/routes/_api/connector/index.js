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
        format(req, res, 'connectorVersion', connectorVersion.get({ plain: true }))
      )
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

      const fileKey = release.filename;

      console.log('Trying to download file', fileKey);

      try {
        const s3 = new S3({
          params: {
            Bucket: release.bucket,
            Key: fileKey,
          },

          credentials: {
            accessKeyId: release.key,
            secretAccessKey: release.secret,
          },
        });

        res.attachment(fileKey);
        const fileStream = s3.getObject().createReadStream();
        fileStream.on('error', e => console.log(e));
        fileStream.pipe(res);
      } catch (e) {
        next(e);
      }
    })
    .catch(next);
});


module.exports = connectorRouter;
