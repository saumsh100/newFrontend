
import { Router } from 'express';
import moment from 'moment';
import {
  convertIntervalStringToObject,
  getDayEnd,
  getDayStart,
} from '@carecru/isomorphic';
import { generateClinicMergeVars, renderTemplate } from '../../../lib/mail';
import { getReminderTemplateName } from '../../../lib/reminders/createReminderText';
import getSmsText from '../../../lib/reminders/reminderTemplate/getSmsText';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { getRemindersOutboxList } from '../../../lib/reminders';
import { mapPatientsToReminders } from '../../../lib/reminders/helpers';
import { getMessageFromTemplates } from '../../../services/communicationTemplate';
import { formatPhoneNumber } from '../../../util/formatters';
import isFeatureFlagEnabled from '../../../lib/featureFlag';
import { NUM_DAYS_DEFAULT } from '../../../config/globals';

const remindersRouter = Router();

remindersRouter.param('accountId', sequelizeLoader('account', 'Account'));
remindersRouter.param('reminderId', sequelizeLoader('reminder', 'Reminder'));

/**
 * GET /:accountId/reminders
 */
remindersRouter.get(
  '/:accountId/reminders',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    if (req.account.id !== req.accountId) {
      return next(
        StatusError(403, 'req.accountId does not match URL account id'),
      );
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
  },
);

/**
 * GET /:accountId/reminders/list
 */
remindersRouter.get(
  '/:accountId/reminders/list',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const { account } = req;
      const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;

      // TODO: add defaults for startDate & endDate

      // TODO: use a getRemindersOutboxList(account, startDate, endDate1)

      const reminders = await Reminder.findAll({
        raw: true,
        where: {
          accountId: account.id,
          isDeleted: false,
          isActive: true,
        },
      });

      const data = await mapPatientsToReminders({
        reminders,
        account,
        startDate,
        endDate,
      });

      const dataWithReminders = data.map((d, i) => ({
        ...d,
        ...reminders[i],
      }));

      res.send(dataWithReminders);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /:accountId/reminders/outbox
 */
remindersRouter.get(
  '/:accountId/reminders/outbox',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const { account } = req;
      const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;
      const outboxList = await getRemindersOutboxList({
        account,
        startDate,
        endDate,
      });
      res.send(outboxList);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * POST /:accountId/reminders
 */
remindersRouter.post(
  '/:accountId/reminders',
  checkPermissions('accounts:read'),
  (req, res, next) => {
    if (req.account.id !== req.accountId) {
      return next(
        StatusError(403, 'req.accountId does not match URL account id'),
      );
    }

    const saveReminder = Object.assign({ accountId: req.accountId }, req.body);

    return Reminder.create(saveReminder)
      .then(reminder =>
        res.status(201).send(normalize('reminder', reminder.dataValues)))
      .catch(next);
  },
);

/**
 * PUT /:accountId/reminders/:reminderId
 */
remindersRouter.put(
  '/:accountId/reminders/:reminderId',
  checkPermissions('accounts:read'),
  (req, res, next) => {
    if (req.accountId !== req.account.id) {
      return next(
        StatusError(
          403,
          "Requesting user's activeAccountId does not match account.id",
        ),
      );
    }

    return req.reminder
      .update(req.body)
      .then(reminder => res.send(normalize('reminder', reminder.dataValues)))
      .catch(next);
  },
);

/**
 * DELETE /:accountId/reminders/:reminderId
 */
remindersRouter.delete(
  '/:accountId/reminders/:reminderId',
  checkPermissions('accounts:read'),
  (req, res, next) => {
    if (req.accountId !== req.account.id) {
      return next(
        StatusError(
          403,
          "Requesting user's activeAccountId does not match account.id",
        ),
      );
    }

    return req.reminder
      .destroy()
      .then(() => res.status(204).send())
      .catch(next);
  },
);

/**
 * GET /:accountId/reminders/:reminderId/preview
 *
 * - purpose of this route is mainly for email templates as we have to go to mandrill
 */
remindersRouter.get(
  '/:accountId/reminders/:reminderId/preview',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      if (req.accountId !== req.account.id) {
        return next(
          StatusError(
            403,
            "Requesting user's activeAccountId does not match account.id",
          ),
        );
      }

      const { reminder, account, userId } = req;
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
      const accountId = account.id;
      const enterpriseId = account.enterpriseId;

      const reminderEmailFooter = await getMessageFromTemplates(
        accountId,
        'reminder-email-final-message',
        {
          numDays: NUM_DAYS_DEFAULT,
          phoneNumber: formatPhoneNumber(account.phoneNumber),
        },
      );

      const version = await isFeatureFlagEnabled(
        'reminder-email-template-version',
        null,
        {
          accountId,
          enterpriseId,
          userId,
          domain: req.hostname,
        },
      );

      const templateName = getReminderTemplateName({
        isConfirmable,
        reminder,
        account,
        version,
      });
      const html = await renderTemplate({
        templateName,
        mergeVars: [
          // defaultMergeVars
          ...generateClinicMergeVars({
            account,
            patient,
          }),
          {
            name: 'APPOINTMENT_DATE',
            content: appointmentDate,
          },
          {
            name: 'APPOINTMENT_TIME',
            content: appointmentTime,
          },
          {
            name: 'REMINDER_EMAIL_FOOTER',
            content: reminderEmailFooter || '',
          },
        ],
      });

      return res.send(html);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
);

/**
 * GET /:accountId/reminders/:reminderId/sms
 *
 * - purpose of this route is for rendering the text that the SMS reminder displays
 */
remindersRouter.get(
  '/:accountId/reminders/:reminderId/sms',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      if (req.accountId !== req.account.id) {
        return next(
          StatusError(
            403,
            "Requesting user's activeAccountId does not match account.id",
          ),
        );
      }

      const { reminder, account } = req;
      const { isConfirmable } = req.query;
      const patient = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const mDate = moment();
      const roundedMinute = Math.round(mDate.minute() / 15) * 15;
      const roundedDate = mDate.minutes(roundedMinute).seconds(0);
      const startDate = roundedDate
        .clone()
        .add(convertIntervalStringToObject(reminder.interval))
        .toISOString();

      const message = await getSmsText({
        patient,
        account,
        reminder,
        appointment: { startDate },
        currentDate: mDate.toISOString(),
        isConfirmable: JSON.parse(isConfirmable),
      });

      return res.send(message);
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = remindersRouter;
