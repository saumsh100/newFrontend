
const twilio = require('twilio');
const { LookupsClient } = twilio;
const globals = require('./globals');

const {
  accountSid,
  authToken,
  phoneNumber,
} = globals.twilio;

// create an authenticated Twilio REST API client
const twilioClient = twilio(accountSid, authToken);
const lookupsClient = new LookupsClient(accountSid, authToken);

module.exports = twilioClient;
module.exports.phoneNumber = phoneNumber;
module.exports.lookupsClient = lookupsClient;
