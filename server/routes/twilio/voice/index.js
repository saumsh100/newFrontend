
import { Router } from 'express';
import twilio from 'twilio';
import Appointment from '../../../models/Appointment';

const voiceRouter = Router();

const actionMessage = () => {
  return 'Press one now to confirm that you can make your appointment. To ' +
    'cancel or reschedule, hang up now and call us. To play back ' +
    'this message, press nine.';
};

const createReminderMessage = (config) => {
  return `Hello ${config.firstName}, this is a friendly reminder from ${config.clinicName} ` +
    `that you have an appointment on ${config.startDate} at ${config.startTime}. ` +
    `${actionMessage()}`;
};


// Handle all automated Call interaction with twilio numbers
voiceRouter.post('/reminders', (req, res, next) => {
  const { Digits } = req.body;
  const {
    firstName,
    clinicName,
    startDate,
    startTime,
  } = req.query;

  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new twilio.TwimlResponse();

  if (!Digits || Digits === '9') {
    const text = createReminderMessage({
      firstName,
      clinicName,
      startDate,
      startTime,
    });

    twiml.gather({
      timeout: 45,
      numDigits: 1,
    }, (gatherNode) => {
      gatherNode.say({ voice: 'alice' }, text);
    });

    twiml.redirect({ method: 'POST' }, '/twilio/voice/reminders');
  } else if (Digits === '1') {
    twiml.say({ voice: 'alice' }, 'Thank you for confirming your appointment. Goodbye.');
    twiml.hangup();
    // TODO: confirm the appointment!
  } else {
    twiml.gather({
      timeout: 30,
      numDigits: 1,
    }, (gatherNode) => {
      gatherNode.say({ voice: 'alice' }, `I'm sorry, that was not a valid response. ${actionMessage()}`);
    });

    twiml.redirect({ method: 'POST' }, '/twilio/voice/reminders');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = voiceRouter;
