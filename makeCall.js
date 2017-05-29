
import twilio from './server/config/twilio';

twilio.calls.create({
  url: 'http://demo.twilio.com/docs/voice.xml',
  to: '+14155551212',
  from: '+15017250604',
}, (err, call) => {
  console.log('call.sid', call.sid);
});
