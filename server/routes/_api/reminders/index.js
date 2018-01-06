
import { Router } from 'express';
import { renderTemplate, generateClinicMergeVars } from '../../../lib/mail';
import { getReminderTemplateName } from '../../../lib/reminders/createReminderText';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { getDayStart, getDayEnd } from '../../../util/time';
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
    const { account } = req;
    const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;

    // TODO: add defaults for startDate & endDate

    const date = (new Date()).toISOString();
    const reminders = await Reminder.findAll({
      raw: true,
      where: {
        accountId: account.id,
        isDeleted: false,
        isActive: true,
      },
    });

    const data = await mapPatientsToReminders({ reminders, account, startDate, endDate });
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

    const { reminder, account } = req;
    const { isConfirmable } = req.query;
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    const templateName = getReminderTemplateName({ isConfirmable, reminder });
    const html = await renderTemplate({
      templateName,
      mergeVars: [
        // defaultMergeVars
        ...generateClinicMergeVars({ account, patient }),
        {
          name: 'APPOINTMENT_DATE',
          content: 'Thursday, September 7th',
        },
        {
          name: 'APPOINTMENT_TIME',
          content: '8:54am',
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
