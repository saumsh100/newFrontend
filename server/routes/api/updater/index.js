const SyncClientVersion = require('../../../models/SyncClientVersion');
const updaterRouter = require('express').Router();
const loaders = require('../../util/loaders');
const checkPermissions = require('../../../middleware/checkPermissions');
const fs = require('fs');

updaterRouter.param('syncClientVersionId', loaders('syncClientVersion', 'SyncClientVersion'));

/**
 * Object to send back to the sync client on update inquiry
 */
const updaterResponse = {
  available: false,
  url: '',
};

const DOWNLOAD_LINK = 'http://carecru.dev:8080/api/updater/download';

/**
 * Return the link to the latest version of the sync client
 */
updaterRouter.get('/latest', checkPermissions('syncClientVersion:read'), (req, res) => {
  Promise.resolve(SyncClientVersion.filter({ latest: true }).run()
    .then((_release) => {
      const release = _release[0];

      const msg = Object.assign(
        {},
        updaterResponse,
        { available: true },
        { url: DOWNLOAD_LINK.concat('/', release.major) },
      );
      res.send(msg);
    }));
});

/**
 * Compare the version of the sync client in the URL params and return JSON
 * saying whether the new version is available or not.
 * TODO add '?' case for if the sync client can't read the version
 */
updaterRouter.get('/available', checkPermissions('syncClientVersion:read'), (req, res) => {
  const reqVersion = parseFloat(req.query.version);

  if (isNaN(reqVersion)) {
    res.sendStatus(400);
    console.log('Invalid version number sent by the sync client. Update cancelled.');
    return;
  }

  Promise.resolve(SyncClientVersion.filter({ latest: true }).run()
    .then((_release) => {
      const release = _release[0];

      if (release.major > reqVersion) {
        const msg = Object.assign(
          {},
          updaterResponse,
          { available: true },
          { url: DOWNLOAD_LINK },
        );
        res.send(msg);
      } else {
        res.send(updaterResponse);
      }
    }));
});

/**
 * Temporary. Will be replaced with S3 bucket.
 */
updaterRouter.get('/download', checkPermissions('syncClientVersion:read'), (req, res) => {
  const filename = 'carecru_setup.exe';
  try {
    if (fs.existsSync()) {
      const fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('[ERROR]', err);
    res.sendStatus(404);
  }
});

/* CRUD on release */

/**
 * Get the latest sync client release info.
 */
updaterRouter.get('/release', checkPermissions('syncClientVersion:read'), (req, res, next) => {
  return SyncClientVersion.filter({ latest: true }).run()
    .then(release => res.send(release[0]))
    .catch(next);
});

/**
 * Update current version of the sync client.
 */
updaterRouter.put('/release', checkPermissions('syncClientVersion:create'), (req, res, next) => {
  const newVersion = Object.assign({}, req.body);
  console.log('updating sc version', req.body);
  console.log('updating sc version', newVersion);

  const dbVersion = SyncClientVersion.filter({ latest: true }).run()
    .then(_dbVersion => _dbVersion[0].merge(newVersion).save());

  return Promise.resolve(dbVersion)
    .then(_dbv => res.send(_dbv))
    .catch(next);
});

/**
 * Set current version of the sync client.
 * TODO this method should be removed/modified to always have one entry for release
 * in the db.
 */
updaterRouter.post('/release', (req, res, next) => {
  const newVersion = Object.assign({}, req.body);
  console.log('received new version', req.body);

  return SyncClientVersion.save(newVersion)
    .then(version => res.sendStatus(201, version))
    .catch(next);
});


module.exports = updaterRouter;
