
import { Router } from 'express';
import { renderTemplate } from '../../../lib/mail';
import { getReminderTemplateName } from '../../../lib/reminders/createReminderText';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { mapPatientsToReminders } from '../../../lib/reminders/helpers';

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
remindersRouter.get('/:accountId/reminders/list', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    // TODO: date needs to be on the 30 minute marks
    const { account } = req;
    const date = (new Date()).toISOString();
    const reminders = await Reminder.findAll({
      raw: true,
      where: { accountId: account.id },
      order: [['lengthSeconds', 'ASC']],
    });

    const data = await mapPatientsToReminders({ reminders, account, date });
    const dataWithReminders = data.map((d, i) => {
      return {
        ...d,
        ...reminders[i],
      };
    });

    res.send(dataWithReminders);
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

/**
 * DELETE /:accountId/reminders/:reminderId/preview
 *
 * - purpose of this route is mainly for email templates as we have to go to mandrill
 */
remindersRouter.get('/:accountId/reminders/:reminderId/preview', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    if (req.accountId !== req.account.id) {
      return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
    }

    const { reminder } = req;
    const { isConfirmable } = req.query;
    const templateName = getReminderTemplateName({ isConfirmable, reminder });
    const html = await renderTemplate({
      templateName,
      mergeVars: [
        {
          name: 'PATIENT_FIRSTNAME',
          content: 'Jane',
        },
        {
          name: 'ACCOUNT_NAME',
          content: 'Chuck',
        },
        {
          name: 'ACCOUNT_PHONENUMBER',
          content: 'account.phoneNumber',
        },
        {
          name: 'ACCOUNT_EMAIL',
          content: 'account.phoneNumber'
        },
      ],
    });

    return res.send(html);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = remindersRouter;
