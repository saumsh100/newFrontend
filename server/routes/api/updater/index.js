const updaterRouter = require('express').Router();
const fs = require('fs');

const LATEST = 2.1;

/**
 * Return the link to the latest version of the sync client
 */
updaterRouter.get('/latest', (req, res, next) => {
  const response = {
    latest: 'http://carecru.dev:8080/updater/download',
  };
  res.send(response);
});

/**
 * Compare the version of the sync client in the URL params and return JSON
 * saying whether the new version is available or not.
 */
updaterRouter.get('/available', (req, res) => {
  // TODO throw error if can't parse this string and sent error back - or don't reply?
  // TODO add '?' case for if the sync client can't read the version
  const reqVersion = parseFloat(req.query.version);
  if (isNaN(reqVersion)) {
    res.sendStatus(400);
    return;
  }

  // TODO don't hardcode the link - make it computed so we can control it without server reboot
  console.log(`SyncClient version=${reqVersion}; latest=${LATEST}.`);
  if (LATEST > reqVersion) {
    const u = {
      available: true,
      url: 'http://carecru.dev:8080/api/updater/download',
    };
    res.send(u);
  } else {
    const u = {
      available: false,
      url: '',
    };
    res.send(u);
  }

});

/**
 * Temporary. Will be replaced with S3 bucket.
 */
updaterRouter.get('/download', (req, res) => {
  const filename = 'carecru_setup.exe';
  const fileStream = fs.createReadStream(filename);
  fileStream.pipe(res);
});

/**
 * Send back the link to the requested version
 */
updaterRouter.get('/', (req, res) => {
  const reqVersion = req.query.ver;
  // TODO send the link to the version requested
});


module.exports = updaterRouter;
