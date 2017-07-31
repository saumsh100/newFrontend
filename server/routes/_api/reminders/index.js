import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import StatusError from '../../../util/StatusError';

const remindersRouter = Router();

remindersRouter.param('accountId', sequelizeLoader('account', 'Account'));
remindersRouter.param('reminderId', sequelizeLoader('reminder', 'Reminder'));

/**
 * GET /:accountId/reminders
 */
remindersRouter.get('/:accountId/reminders', checkPermissions('accounts:read'), async (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  try {
    const reminders = await Reminder.findAll({
      raw: true,
      where: { accountId: req.accountId },
    });

    res.send(normalize('reminders', reminders));
  } catch (error) {
    next(error);
  }
});

/**
 * POST /:accountId/reminders
 */
remindersRouter.post('/:accountId/reminders', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const saveReminder = Object.assign({ accountId: req.accountId }, req.body);

  return Reminder.create(saveReminder)
    .then(reminder => res.status(201).send(normalize('reminder', reminder.dataValues)))
    .catch(next);
});

/**
 * PUT /:accountId/reminders/:reminderId
 */
remindersRouter.put('/:accountId/reminders/:reminderId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  return req.reminder.update(req.body)
    .then(reminder => res.send(normalize('reminder', reminder.dataValues)))
    .catch(next);
});

/**
 * DELETE /:accountId/reminders/:reminderId
 */
remindersRouter.delete('/:accountId/reminders/:reminderId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  return req.reminder.destroy()
    .then(() => res.status(204).send())
    .catch(next);
});


module.exports = remindersRouter;
