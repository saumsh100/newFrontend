import { callrails, vendasta } from '../config/globals';
import twilioClient from '../config/twilio';
const axios = require('axios');

const uuid = require('uuid').v4;

const {
  apiKey,
  apiUser,
} = vendasta;

export async function twilioDelete(account) {
  // Right now default to Canada numbers. Maybe add a country dropdown in account creation.
  if (!account.destinationPhoneNumber) {
    return null;
  }
  try {
    const test = await twilioClient.incomingPhoneNumbers.list();
    let phoneNumberId;
    for (let i = 0; i < test.incomingPhoneNumbers.length; i += 1) {
      if (account.twilioPhoneNumber === test.incomingPhoneNumbers[i].phone_number) {
        phoneNumberId = test.incomingPhoneNumbers[i].sid;
        console.log(test.incomingPhoneNumbers[i]);
      }
    }

    console.log(phoneNumberId)
    if (!phoneNumberId) {
      throw 'ERROR';
    }
    await twilioClient.incomingPhoneNumbers(phoneNumberId).delete();
  } catch (e) {
    console.log(e);
    console.log('Twilio Account Creation Failed');
  }
}
