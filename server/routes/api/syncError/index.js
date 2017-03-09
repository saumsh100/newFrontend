const syncErrorRouter = require('express').Router();
const SyncError = require('../../../models/SyncError');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');

syncErrorRouter.param('syncErrorId', loaders('syncError', 'SyncError'));

/**
 * Get all errors for a particular clinic
 */
syncErrorRouter.get('/', checkPermissions('syncErrors:read'), (req, res, next) => {
  const accountId = req.query.accountId;
  
  return SyncError.filter({ accountId }).run()
    .then(syncErrors => res.send(normalize('syncErrors', syncErrors)))
    .catch(next);
});

/**
 * Create error
 */
syncErrorRouter.post('/', checkPermissions('syncErrors:create'), (req, res, next) => {
  const syncErrorData = Object.assign({}, req.body, { accountId: req.accountId });

  return SyncError.save(syncErrorData)
    .then(() => res.sendStatus(201))
    .catch(next);
});

module.exports = syncErrorRouter;
