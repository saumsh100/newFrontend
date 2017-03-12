const updaterRouter = require('express').Router();
const fs = require('fs');

const LATEST = 2.1;

/**
 * Object to send back to the sync client on update inquiry
 */
const updaterResponse = {
  available: false,
  url: '',
};

/**
 * Return the link to the latest version of the sync client
 */
updaterRouter.get('/latest', (req, res) => {
  const msg = Object.assign({},
    updaterResponse,
    { available: true },
    { url: 'http://carecru.dev:8080/updater/download'.concat('/', LATEST) },
  );
  res.send(msg);
});

/**
 * Compare the version of the sync client in the URL params and return JSON
 * saying whether the new version is available or not.
 * TODO add '?' case for if the sync client can't read the version
 */
updaterRouter.get('/available', (req, res) => {
  const reqVersion = parseFloat(req.query.version);
  if (isNaN(reqVersion)) {
    res.sendStatus(400);
    console.log('Invalid version number sent by the sync client. Update cancelled.');
    return;
  }

  console.log(`SyncClient version=${reqVersion}; latest=${LATEST}.`);
  if (LATEST > reqVersion) {
    const msg = Object.assign(
      {},
      updaterResponse,
      { available: true },
      { url: 'http://carecru.dev:8080/api/updater/download' },
    );
    res.send(msg);
  } else {
    res.send(updaterResponse);
  }
});

/**
 * Temporary. Will be replaced with S3 bucket.
 */
updaterRouter.get('/download', (req, res) => {
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

module.exports = updaterRouter;
