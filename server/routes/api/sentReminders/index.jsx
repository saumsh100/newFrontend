
const sentRemindersRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const SentReminder = require('../../../models/SentReminder');

sentRemindersRouter.param('sentReminderId', loaders('sentReminder', 'SentReminder'));

/**
 * Get all Sent Reminders under a clinic
 */
sentRemindersRouter.get('/', checkPermissions('sentReminders:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  // Todo: Add query option

  return SentReminder
    .filter({ accountId })
    .getJoin(joinObject)
    .run()
    .then(sentReminders => res.send(normalize('sentReminders', sentReminders)))
    .catch(next);
});

module.exports = sentRemindersRouter;
