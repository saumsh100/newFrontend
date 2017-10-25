import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { getAppointmentsFromReminder } from '../../../lib/reminders/helpers';

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
 * GET /:accountId/reminders/stats
 */
remindersRouter.get('/:accountId/reminders/stats', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const date = (new Date()).toISOString();
    const reminders = await Reminder.findAll({
      raw: true,
      where: { accountId: req.accountId },
      order: [['lengthSeconds', 'ASC']],
    });

    const data = [];
    const seen = {};
    for (const reminder of reminders) {
      const appts = await getAppointmentsFromReminder({ reminder, account: req.account, date });
      const unseenAppts = appts.filter(a => !seen[a.id]);
      unseenAppts.forEach(a => seen[a.id] = true);

      const failAppts = unseenAppts.filter((a) => {
        if (a.primaryType === 'sms' || a.primaryType === 'phone') {
          return !a.patient.mobilePhoneNumber;
        } else {
          return !a.patient.email;
        }
      });

      data.push({
        ...reminder,
        success: unseenAppts.length - failAppts.length,
        fail: failAppts.length,
      });
    }

    res.send(data);
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
