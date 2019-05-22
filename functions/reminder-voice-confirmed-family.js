
/**
 *  This Function builds an IVR menu for the reminder-voice-confirmed-family robocall.
 */
exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  try {
    switch (event.Digits) {
      case '0':
        twiml.dial(event.practiceNumber);
        break;
      default:
        twiml.say(
          'Hi there, this is a friendly reminder for upcoming appointments at ',
        );
        twiml.say(event.practiceName);
        twiml.say('on');
        twiml.say(event.startDate);
        twiml.say('for the following family members.');
        twiml.say(event.dependants);
        twiml
          .gather({
            numDigits: 1,
            timeout: 60,
          })
          .say(
            'To speak to someone at our front desk, press zero. To play back this message, press nine.',
          );
        break;
    }
    twiml.say('Thank you. Goodbye.');
  } catch (e) {
    console.error(e);
  }

  callback(null, twiml);
};
