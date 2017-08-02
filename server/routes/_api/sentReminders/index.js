
import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { SentReminder } from '../../../_models';


const sentRemindersRouter = Router();

sentRemindersRouter.param('sentReminderId', sequelizeLoader('sentReminder', 'SentReminder'));

/**
 * Get all Sent Reminders under a clinic
 */
sentRemindersRouter.get('/', checkPermissions('sentReminders:read'), async (req, res, next) => {
  const {
    accountId,
    joinObject,
    includeArray,
    query,
  } = req;

  let {
    startDate,
    endDate,
  } = query;

  // Todo: setup date variable
  startDate = startDate || moment().subtract(1, 'years').toISOString();
  endDate = endDate || moment().toISOString();

  try {
    const sentReminders = await SentReminder.findAll({
      raw: true,
      nest: true,
      where: {
        accountId,
        createdAt: {
          $lte: endDate,
          $gte: startDate,
        },
        isSent: true,
      },
      include: includeArray,
    });

    const filterSentReminders = sentReminders.filter((sentReminder) => {
      const appointment = sentReminder.appointment;
      if (!appointment.isDeleted && !appointment.isCancelled) {
        return sentReminder;
      }
    });

    res.send(normalize('sentReminders', filterSentReminders));
  } catch (error) {
    next(error);
  }
});

module.exports = sentRemindersRouter;
