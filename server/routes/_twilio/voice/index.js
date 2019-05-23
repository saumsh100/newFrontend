
import { Router } from 'express';
import Twilio from 'twilio';
import {
  Account,
  Appointment,
  Reminder,
  Patient,
  SentRemindersPatients,
} from 'CareCruModels';
import { sequelizeLoader } from '../../util/loaders';

const voiceRouter = Router();

voiceRouter.param(
  'sentReminderId',
  sequelizeLoader('sentReminder', 'SentReminder', [
    {
      model: Patient,
      as: 'patient',
    },
    {
      model: Reminder,
      as: 'reminder',
    },
    {
      model: Account,
      as: 'account',
    },
    {
      model: SentRemindersPatients,
      as: 'sentRemindersPatients',
      include: [
        {
          model: Appointment,
          as: 'appointment',
        },
        {
          model: Patient,
          as: 'patient',
        },
      ],
    },
  ]),
);

voiceRouter.get(
  '/sentReminders/:sentReminderId/confirm',
  async ({ sentReminder }, res, next) => {
    const { VoiceResponse } = Twilio.twiml;
    const twiml = new VoiceResponse();

    await sentReminder.update({ isConfirmed: true });

    // For any confirmed reminder we confirm appointment
    const { reminder, sentRemindersPatients } = sentReminder;

    try {
      await Promise.all(
        sentRemindersPatients.map(({ appointment }) =>
          appointment.confirm(reminder)),
      );

      res.type('text/xml');
      res.send(twiml.toString());
    } catch (err) {
      next(err);
    }
  },
);

voiceRouter.get(
  '/sentReminders/robocallPreview/confirmed/',
  async (req, res, next) => {
    const { VoiceResponse } = Twilio.twiml;
    const twiml = new VoiceResponse();

    try {
      res.type('text/xml');
      res.send(twiml.toString());
    } catch (err) {
      next(err);
    }
  },
);

module.exports = voiceRouter;
