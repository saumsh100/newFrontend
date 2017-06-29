const sentRemindersRouter = require('express').Router();
const { r } = require('../../../config/thinky');
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
    query,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  // Todo: setup date variable
  startDate = startDate ? r.ISO8601(startDate) : r.now();
  endDate = endDate ? r.ISO8601(endDate) : r.now().add(365 * 24 * 60 * 60);

  return SentReminder
    .filter({ accountId, isSent: true })
    //.filter(r.row('startDate').during(startDate, endDate))
    .getJoin(joinObject)
    .run()
    .then((sentReminders) => {
      const filterSentReminders = sentReminders.filter((sentReminder) => {
        const appointment = sentReminder.appointment;
        if (!appointment.isDeleted && !appointment.isCancelled) {
          return sentReminder;
        }
      });

      return res.send(normalize('sentReminders', filterSentReminders))
    })
    .catch(next);
});


sentRemindersRouter.get('/:sentReminderId/confirm', (req, res, next) => {
   console.log('in here!!!!!!');
});


module.exports = sentRemindersRouter;
