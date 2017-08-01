import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import moment from 'moment';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { SentReminder, Appointment, Patient, Reminder } from '../../../_models';


const sentRemindersRouter = Router();

sentRemindersRouter.param('sentReminderId', sequelizeLoader('sentReminder', 'SentReminder'));

/**
 * Get all Sent Reminders under a clinic
 */
sentRemindersRouter.get('/', checkPermissions('sentReminders:read'), async (req, res, next) => {
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
  startDate = startDate || moment().subtract(1, 'years');
  endDate = endDate || moment();

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
      include: [{
        model: Reminder, as: 'reminder',
      },{
        model: Appointment, as: 'appointment',
      },{
        model: Patient, as: 'patient',
      }],
    });

    const filterSentReminders = sentReminders.filter((sentReminder) => {
      const appointment = sentReminder.appointment;
      if (!appointment.isDeleted && !appointment.isCancelled) {
        return sentReminder;
      }
    });

    res.send(normalize('sentReminders', filterSentReminders))
  } catch (error) {
    next(error);
  }
});

module.exports = sentRemindersRouter;
