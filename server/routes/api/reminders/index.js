
const remindersRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');
const Reminder = require('../../../models/Reminder');
const StatusError = require('../../../util/StatusError');
const { Account } = require('../../../models');
const uuid = require('uuid').v4;

remindersRouter.param('accountId', loaders('account', 'Account', { enterprise: true }));
remindersRouter.param('reminderId', loaders('reminder', 'Reminder'));

/**
 * GET /:accountId/reminders
 */
remindersRouter.get('/:accountId/reminders', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  return Reminder.filter({accountId: req.accountId})
  .run()
  .then((reminders) => {
    res.send(normalize('reminders', reminders));
  })
  .catch(next);

});

/**
 * POST /:accountId/reminders
 */
remindersRouter.post('/:accountId/reminders', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const saveReminder = Object.assign({ accountId: req.accountId }, req.body);
  return Reminder.save(saveReminder).then((reminder) => {
    res.send(normalize('reminder', reminder));
  }).catch(next);
});

/**
 * PUT /:accountId/reminders/:reminderId
 */
remindersRouter.put('/:accountId/reminders/:reminderId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  return req.reminder.merge(req.body).save()
  .then(reminder => {
    res.send(normalize('reminder', reminder));
  })
  .catch(next);
});

/**
 * DELETE /:accountId/reminders/:reminderId
 */
remindersRouter.delete('/:accountId/reminders/:reminderId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }
  return req.reminder.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = remindersRouter;
