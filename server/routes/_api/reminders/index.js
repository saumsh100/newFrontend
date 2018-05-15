
import { Router } from 'express';
import moment from 'moment';
import { renderTemplate, generateClinicMergeVars } from '../../../lib/mail';
import { getReminderTemplateName } from '../../../lib/reminders/createReminderText';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { getDayStart, getDayEnd } from '../../../util/time';
import { getRemindersOutboxList } from '../../../lib/reminders';
import { mapPatientsToReminders } from '../../../lib/reminders/helpers';

const remindersRouter = Router();

remindersRouter.param('accountId', sequelizeLoader('account', 'Account'));
remindersRouter.param('reminderId', sequelizeLoader('reminder', 'Reminder'));

/**
 * GET /:accountId/reminders
 */
remindersRouter.get('/:accountId/reminders', checkPermissions('accounts:read'), async (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
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
 * GET /:accountId/reminders/list
 */
remindersRouter.get('/:accountId/reminders/list', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const { account } = req;
    const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;

    // TODO: add defaults for startDate & endDate

    const date = (new Date()).toISOString();

    // TODO: use a getRemindersOutboxList(account, startDate, endDate1)

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
 * GET /:accountId/reminders/outbox
 */
remindersRouter.get('/:accountId/reminders/outbox', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const { account } = req;
    const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;
    const outboxList = await getRemindersOutboxList({ account, startDate, endDate });
    res.send(outboxList);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /:accountId/reminders
 */
remindersRouter.post('/:accountId/reminders', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
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

    const mDate = moment();
    const roundedMinute = Math.round(mDate.minute() / 15) * 15;
    const formattedDate = mDate.minutes(roundedMinute).seconds(0);
    const appointmentDate = formattedDate.format('dddd, MMMM Do');
    const appointmentTime = formattedDate.format('h:mma');

    const templateName = getReminderTemplateName({ isConfirmable, reminder });
    const html = await renderTemplate({
      templateName,
      mergeVars: [
        // defaultMergeVars
        ...generateClinicMergeVars({ account, patient }),
        {
          name: 'APPOINTMENT_DATE',
          content: appointmentDate,
        },
        {
          name: 'APPOINTMENT_TIME',
          content: appointmentTime,
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
