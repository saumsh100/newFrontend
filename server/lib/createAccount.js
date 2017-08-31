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
  const test = await twilioClient.availablePhoneNumbers('US').local.list({
    nearLatLong: '37.840699,-122.461853',
    distance: '50',
    contains: '555',
    inRegion: 'CA'
  });
  console.log(test);
}

export default async function createAccount(account) {
  // callRail(account);
  twilioSetup(account);
  return null;
}
