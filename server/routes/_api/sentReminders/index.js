
import moment from 'moment';
import { Router } from 'express';
import { SentReminder, SentRemindersPatients } from 'CareCruModels';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';

const sentRemindersRouter = Router();

sentRemindersRouter.param('sentReminderId', sequelizeLoader('sentReminder', 'SentReminder'));

/**
 * Get all Sent Reminders under a clinic
 */
sentRemindersRouter.get('/', checkPermissions('sentReminders:read'), async (req, res, next) => {
  const {
    accountId,
    includeArray,
  } = req;

  // Todo: setup date variable

  const baseInclude = includeArray
    .filter(included => included.as === 'reminder')
    .map(included => ({
      ...included,
      required: true,
    }));

  const patientInclude = includeArray.filter(included => included.as !== 'reminder');

  try {
    const sentReminders = await SentReminder.findAll({
      nest: true,
      where: {
        accountId,
        createdAt: { $gte: moment().startOf('day').toISOString() },
        isSent: true,
      },
      include: [...baseInclude, {
        model: SentRemindersPatients,
        as: 'sentRemindersPatients',
        required: true,
        include: patientInclude,
      }],
    });

    const filterSentReminders = sentReminders.map(v => v.get({ plain: true }))
      .map((sentReminder) => {
        const pocSentReminder = sentReminder.sentRemindersPatients
          .find(p => p.patientId === sentReminder.contactedPatientId);
        const pocAppointment = pocSentReminder.appointment;
        const pocPatient = pocSentReminder.patient;

        return {
          ...sentReminder,
          appointment: pocAppointment,
          patient: pocPatient,
          sentRemindersPatients: sentReminder
            .sentRemindersPatients
            .filter(({ appointment }) => (!appointment.isDeleted && !appointment.isCancelled)),
        };
      }).filter(({ sentRemindersPatients }) => sentRemindersPatients.length > 0);

    res.send(normalize('sentReminders', filterSentReminders));
  } catch (error) {
    next(error);
  }
});

module.exports = sentRemindersRouter;
