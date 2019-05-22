
/**
 *  This Function builds an IVR menu for the reminder-voice-unconfirmed-family robocall.
 */
exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  try {
    switch (event.Digits) {
      case '1':
        twiml.redirect({ method: 'GET' }, event.confirmAppointmentEndpoint);
        break;
      case '0':
        twiml.dial(event.practiceNumber);
        break;
      default:
        twiml.say(
          'Hi there, we are calling to confirm upcoming appointments at',
        );
        twiml.say(event.practiceName);
        twiml.say('on');
        twiml.say(event.startDate);
        twiml.say('for the following family members:');
        twiml.say(event.dependants);
        twiml
          .gather({
            numDigits: 1,
            timeout: 60,
          })
          .say(
            'To confirm, press 1. To speak to someone at our front desk, press zero. To play back this message, press nine.',
          );
        break;
    }
    twiml.say('Thank you. Goodbye.');
  } catch (e) {
    console.error(e);
  }

  callback(null, twiml);
};
