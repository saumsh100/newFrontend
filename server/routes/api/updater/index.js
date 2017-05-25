const SyncClientVersion = require('../../../models/SyncClientVersion');
const updaterRouter = require('express').Router();
const loaders = require('../../util/loaders');
const checkPermissions = require('../../../middleware/checkPermissions');
const _ = require('lodash');

updaterRouter.param('syncClientVersionId', loaders('syncClientVersion', 'SyncClientVersion'));

/**
 * Return the link to the latest version of the sync client
 */
updaterRouter.get('/latest', checkPermissions('syncClientVersion:read'), (req, res) => {
  Promise.resolve(SyncClientVersion.nth(0).run()
    .then((release) => {
      const msg = Object.assign(
        {},
        _.pick(release, ['url']),
      );
      res.send(msg);
    }));
});

/**
 * Compare the version of the sync client in the URL params and return JSON
 * saying whether the new version is available or not.
 */
updaterRouter.get('/available', checkPermissions('syncClientVersion:read'), (req, res, next) => {
  const reqVersion = parseFloat(req.query.version);

  if (isNaN(reqVersion)) {
    res.sendStatus(400);
    console.log('Invalid version number sent by the sync client. Update cancelled.');
    return;
  }

  Promise.resolve(SyncClientVersion.nth(0).run()
    .then((release) => {
      if (release.version > reqVersion) {
        const msg = Object.assign(
          release,
          { available: true },
        );
        res.send(msg);
      } else {
        res.send({
          available: false,
          url: '',
        });
      }
    })
    .catch(next));
});

/**
 * @param
 * @return boolean
 */
function isUpdateAvailable() {

}

/**
 * Get the latest sync client release info.
 */
updaterRouter.get('/release', checkPermissions('syncClientVersion:read'), (req, res, next) => {
  return SyncClientVersion.nth(0).run()
    .then(release => res.send(release))
    .catch(next);
});

/**
 * Update current version of the sync client.
 */
updaterRouter.put('/release', checkPermissions('syncClientVersion:create'), (req, res, next) => {
  const newVersion = Object.assign({}, req.body);

  return Promise.resolve(
    SyncClientVersion.nth(0).run()
        .then(_dbVersion => _dbVersion.merge(newVersion).save())
        .catch(next))
      .then(_dbv => res.send(_dbv))
      .catch(next);
});

module.exports = updaterRouter;
