
import { Router } from 'express';
import Twilio from 'twilio';
import {
  Appointment,
  Reminder,
  SentReminder,
} from '../../../_models';

const voiceRouter = Router();

const actionMessage = () => 'Press one now to confirm that you can make your appointment. To ' +
  'cancel or reschedule, hang up now and call us. To play back ' +
  'this message, press nine.';

const createReminderMessage = ({ firstName, clinicName, startDate, startTime }) => `Hello ${firstName}, this is a friendly reminder from ${clinicName} ` +
  `that you have an appointment on ${startDate} at ${startTime}. ${actionMessage()}`;


// Handle all automated Call interaction with twilio numbers
voiceRouter.post('/sentReminders/:sentReminderId', async (req, res, next) => {
  const sentReminder = await SentReminder.findOne({
    where: { id: req.params.sentReminderId },
    include: [
      {
        model: Appointment,
        as: 'appointment',
      },
      {
        model: Reminder,
        as: 'reminder',
      },
    ],
    raw: true,
    nest: true,
  });

  if (!sentReminder) {
    return res.sendStatus(404);
  }
  const { appointment, reminder } = sentReminder;

  // Use the Twilio Node.js SDK to build an XML response
  const { VoiceResponse } = Twilio.twiml;
  const twiml = new VoiceResponse();

  const { Digits } = req.body;
  const {
    firstName,
    clinicName,
    startDate,
    startTime,
  } = req.query;

  if (!Digits || Digits === '9') {
    const gather = twiml.gather({
      timeout: 45,
      numDigits: 1,
    });
    const text = createReminderMessage({
      firstName,
      clinicName,
      startDate,
      startTime,
    });

    gather.say({ voice: 'alice' }, text);
    twiml.redirect({ method: 'POST' }, req.originalUrl);
  } else if (Digits === '1') {
    twiml.say({ voice: 'alice' }, 'Thank you for confirming your appointment. Goodbye.');
    twiml.hangup();

    // Confirm the appointment if any one sentReminder is confirmed
    await sentReminder.update({ isConfirmed: true });
    await appointment.confirm(reminder);
  } else {
    const gather = twiml.gather({
      timeout: 30,
      numDigits: 1,
    });

    gather.say({ voice: 'alice' }, `I'm sorry, that was not a valid response. ${actionMessage()}`);
    twiml.redirect({ method: 'POST' }, '/twilio/voice/reminders');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = voiceRouter;
