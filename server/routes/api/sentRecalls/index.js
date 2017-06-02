
const sentRecallsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const SentRecall = require('../../../models/SentRecall');

sentRecallsRouter.param('sentRecallId', loaders('sentRecall', 'SentRecall'));

/**
 * Get all Recalls under a clinic
 */
sentRecallsRouter.get('/', checkPermissions('sentRecalls:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  // Todo: Add query option

  return SentRecall
    .filter({ accountId })
    .getJoin(joinObject)
    .run()
    .then(sentRecalls => res.send(normalize('sentRecalls', sentRecalls)))
    .catch(next);
});

module.exports = sentRecallsRouter;
