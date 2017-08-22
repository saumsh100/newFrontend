
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
  startDate = startDate || moment().add(1, 'years').toISOString();
  endDate = endDate || moment().toISOString();

  const include = includeArray.map((included) => {
    if (included.as === 'reminder') {
      return {
        ...included,
        required: true,
      };
    }
    return included;
  });
  console.log(moment().startOf('day'));
  try {
    const sentReminders = await SentReminder.findAll({
      raw: true,
      nest: true,
      where: {
        accountId,
        createdAt: {
          $gte: moment().startOf('day').toISOString(),
        },
        isSent: true,
      },
      include,
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
