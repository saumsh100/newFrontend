
const twilio = require('twilio');
const globals = require('./globals');

const twilioConfig = globals.twilio;

// create an authenticated Twilio REST API client
const twilioClient = twilio(
  twilioConfig.accountSid,
  twilioConfig.authToken
);

module.exports = twilioClient;
