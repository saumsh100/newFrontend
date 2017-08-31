import request from 'request-promise';
import { callrails } from '../config/globals';
import twilioClient from '../config/twilio';

async function callRail(account) {
  console.log(callrails)
  const options = {
    uri: `https://api.callrail.com/v2/a/${callrails.apiAccount}/companies.json`,
    headers: {
      Authorization: `Token token=${callrails.apiKey}`,
    },
    json: true,
  };

  const test = await request(options);
  console.log(test)
}

async function twilioSetup(account) {
  // Right now default to Canada numbers. Maybe add a country dropdown in account creation.
  console.log(account)
  console.log(account.destinationPhoneNumber.replace(/\D/g, '').substr(2, 3))
  const test = await twilioClient.availablePhoneNumbers('CA').local.list({
    areaCode: '604',
    smsEnabled: true,
    voiceEnabled: true,
  });
  console.log(test);
}

export default async function createAccount(account) {
  // callRail(account);
  twilioSetup(account);
  return null;
}
