
import { Router } from 'express';
import twilio from 'twilio';
import Appointment from '../../../models/Appointment';

const voiceRouter = Router();

const actionMessage = () => (`
  Press one now to confirm that you can make your appointment. If you can't make it,
  hang up now and call us to cancel and or reschedule. If you would like to play back
  this message, press nine.
`);

const createReminderMessage = (config) => (`
  Hello ${config.firstName}, this is a friendly reminder from ${config.clinicName}
  that you have an appointment on ${config.date}.
  ${actionMessage()}
`);


// Handle all automated Call interaction with twilio numbers
voiceRouter.post('/', (req, res, next) => {
  console.log('body', req.body);


  const { Digits } = req.body;

  console.log('Digits', Digits);

  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new twilio.TwimlResponse();

  if (!Digits || Digits === '9') {
    const text = createReminderMessage({
      firstName: 'Mark',
      clinicName: 'Beckett Dental',
      date: 'Wednesday, May 31st',
    });

    twiml.gather({
      timeout: 45,
      numDigits: 1,
    }, (gatherNode) => {
      gatherNode.say({ voice: 'alice' }, text);
    });

    twiml.redirect({ method: 'POST' }, '/twilio/voice');
  } else if (Digits === '1') {
    twiml.say({ voice: 'alice' }, 'Thank you for confirming your appointment. Goodbye.');
    twiml.hangup();
  } else {
    twiml.gather({
      timeout: 30,
      numDigits: 1,
    }, (gatherNode) => {
      gatherNode.say({ voice: 'alice' }, `I'm sorry, that was not a valid response. ${actionMessage()}`);
    });

    twiml.redirect({ method: 'POST' }, '/twilio/voice');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

module.exports = voiceRouter;
