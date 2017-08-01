import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import { SyncClientVersion } from '../../../_models';
import checkPermissions from '../../../middleware/checkPermissions';

const updaterRouter = new Router();

updaterRouter.param('syncClientVersionId', sequelizeLoader('syncClientVersion', 'SyncClientVersion'));

/**
 * Return the link to the latest version of the sync client
 */
// updaterRouter.get('/latest', checkPermissions('syncClientVersion:read'), (req, res) => {
//   Promise.resolve(SyncClientVersion.nth(0).run()
//     .then((release) => {
//       const msg = Object.assign(
//         {},
//         _.pick(release, ['url']),
//       );
//       res.send(msg);
//     }));
// });

/**
 * Compare the version of the sync client in the URL params and return JSON
 * saying whether the new version is available or not.
 */
updaterRouter.get('/available', checkPermissions('syncClientVersion:read'), (req, res, next) => {
  const reqVersion = req.query.version.split('.');
  const versionObject = Object.assign({}, {
    major: reqVersion[0],
    minor: reqVersion[1],
    patch: reqVersion[2],
    build: reqVersion[3],
  });
  console.log(`Update check by SyncClient accountId=${req.accountId} with version=${JSON.stringify(versionObject)}`);

  if (!isValidVersionObject(versionObject)) {
    res.sendStatus(400);
    console.log(`Update cancelled. Invalid version number sent by SyncClient accountId=${req.accountId}.`);
    return;
  }

  SyncClientVersion.findOne()
    .then((release) => {
      if (isUpdateAvailable(versionObject, release)) {
        const filename = `carecru_setup_v${release.major}.${release.minor}.${release.patch}-${release.build}.exe`;
        res.send({
          available: true,
          path: release.path,
          bucket: release.bucket,
          filename,
          key: release.key,
          secret: release.secret,
        });
      } else {
        res.send({
          available: false, url: '',
        });
      }
    }).catch(next);
});

/**
 * Make sure version values are numbers
 * @param versionObject with all 4 blocks of version
 * @return boolean. True if object is valid (all values are numbers), false otherwise.
 */
function isValidVersionObject(versionObject) {
  return !isNaN(versionObject.major) && !isNaN(versionObject.minor)
    && !isNaN(versionObject.patch) && !isNaN(versionObject.build);
}

/**
 * @param versionObject with all 4 blocks of version
 * @param releaseInfo a model that also contains 4 blocks of version as they are in the db
 * @return boolean. True if update is available, false if not.
 */
function isUpdateAvailable(versionObject, releaseInfo) {
  return releaseInfo.major > versionObject.major
    || releaseInfo.minor > versionObject.minor
    || releaseInfo.patch > versionObject.patch
    || releaseInfo.build > versionObject.build
    || false;
}

/**
 * Get the latest sync client release info.
 */
updaterRouter.get('/release', checkPermissions('syncClientVersion:read'), (req, res, next) => {
  SyncClientVersion.findOne()
    .then(release => res.send(release))
    .catch(next);
});

/**
 * Bump the build version of the sync client by 1.
 */
updaterRouter.put('/bump', checkPermissions('syncClientVersion:create'), (req, res, next) => {
  SyncClientVersion.findOne()
    .then((_dbVersion) => {
      _dbVersion.build += 1;
      _dbVersion.patch = _dbVersion.build; // for now
      _dbVersion.update(_dbVersion)
        .then(_dbv => res.send(_dbv));
    });
});

/**
 * Decrement build version by 1
 */
updaterRouter.put('/unbump', checkPermissions('syncClientVersion:create'), (req, res, next) => {
  SyncClientVersion.findOne()
    .then((_dbVersion) => {
      _dbVersion.build -= 1;
      _dbVersion.patch = _dbVersion.build; // for now
      _dbVersion.update(_dbVersion)
        .then(_dbv => res.send(_dbv));
    });
});

module.exports = updaterRouter;
