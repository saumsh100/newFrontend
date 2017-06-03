const sentRecallsRouter = require('express').Router();
const { r } = require('../../../config/thinky');
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
    query,
  } = req;


  let {
    startDate,
    endDate,
  } = query;

  // Todo: setup date variable
  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  return SentRecall
    .filter({ accountId })
   // .filter(r.row('startDate').during(startDate, endDate))
    .getJoin(joinObject)
    .run()
    .then(sentRecalls => res.send(normalize('sentRecalls', sentRecalls)))
    .catch(next);
});

module.exports = sentRecallsRouter;
