
/**
 *  This Function builds an IVR menu for the reminder-voice-confirmed-family robocall.
 */
exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  const assetsUrl = `https://${context.DOMAIN_NAME}/assets`;
  const sayAttr = { voice: 'Polly.Salli' };
  try {
    switch (event.Digits) {
      case '0':
        twiml.dial(event.practiceNumber);
        break;
      default:
        twiml.play(`${assetsUrl}/09.wav`);
        twiml.say(sayAttr, event.practiceName);
        twiml.play(`${assetsUrl}/02.wav`);
        twiml.say(sayAttr, event.startDate);
        twiml.play(`${assetsUrl}/08.wav`);
        twiml.say(sayAttr, event.dependants);
        twiml
          .gather({
            numDigits: 1,
            timeout: 60,
          })
          .play(`${assetsUrl}/05.wav`);
        break;
    }
    twiml.play(`${assetsUrl}/10.wav`);
  } catch (e) {
    console.error(e);
  }

  callback(null, twiml);
};