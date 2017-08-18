const syncControlRouter = require('express').Router();
// const checkPermissions = require('../../../middleware/checkPermissions');
const { namespaces } = require('../../../config/globals');
const normalize = require('../normalize');
const { Account } = require('../../../_models');

syncControlRouter.post('/runSync', (req, res, next) => {
  const io = req.app.get('socketio');
  console.log(`On demand sync. AccountId=${req.accountId}`);

  res.send('On-demand sync trigger sent.');
  io.of(namespaces.sync)
    .in(req.accountId)
    .emit('runSync', '');
});

syncControlRouter.post('/finishSync', async (req, res, next) => {
  try {
    const io = req.app.get('socketio');
    console.log(`Sync finished. AccountId=${req.accountId}`);

    // Early return for code safety reasons
    res.sendStatus(200);

    const account = await Account.findById(req.accountId);
    const newAccount = await account.update({ lastSyncDate: new Date() });

    io.of(namespaces.dash)
      .in(req.accountId)
      .emit('syncFinished', normalize('account', newAccount.get({ plain: true })));
  } catch (err) {
    next(err);
  }
});

syncControlRouter.post('/progress', (req, res, next) => {
  const io = req.app.get('socketio');
  console.log(`Sync progress: accountId=${req.accountId}; progress=`, req.body);
  io.of(namespaces.dash)
    .in(req.accountId)
    .emit('syncProgress', req.body);
  res.sendStatus(200);
});

module.exports = syncControlRouter;
