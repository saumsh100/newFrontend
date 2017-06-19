const syncControlRouter = require('express').Router();
// const checkPermissions = require('../../../middleware/checkPermissions');
const { namespaces } = require('../../../config/globals');

syncControlRouter.post('/runSync', (req, res, next) => {
  const io = req.app.get('socketio');
  console.log(`On demand sync. AccountId=${req.accountId}`);

  res.send('On-demand sync trigger sent.');
  io.of(namespaces.sync)
    .in(req.accountId)
    .emit('runSync', '');
});

syncControlRouter.post('/finishSync', (req, res, next) => {
  const io = req.app.get('socketio');
  console.log(`Sync finished. AccountId=${req.accountId}`);

  io.of(namespaces.dash)
    .in(req.accountId)
    .emit('syncFinished');
  res.sendStatus(200);
});

module.exports = syncControlRouter;
