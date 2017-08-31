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
  if (!account.destinationPhoneNumber) {
    return null;
  }

  console.log(account)
  console.log(account.destinationPhoneNumber.replace(/\D/g, '').substr(1, 3));
  const areaCode = account.destinationPhoneNumber.replace(/\D/g, '').substr(1, 3);
  const data = await twilioClient.availablePhoneNumbers('CA').local.list({
    areaCode,
    smsEnabled: true,
    voiceEnabled: true,
  });

  const number = data.availablePhoneNumbers[0];
  await twilioClient.incomingPhoneNumbers.create({
    phoneNumber: number.phone_number,
    friendlyNumber: account.name,
  })
  console.log(test);
}

export default async function createAccount(account) {
  // callRail(account);
  twilioSetup(account);
  return null;
}
