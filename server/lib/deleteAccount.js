import { callrails, vendasta } from '../config/globals';
import twilioClient from '../config/twilio';
const axios = require('axios');

const uuid = require('uuid').v4;

const {
  apiKey,
  apiUser,
} = vendasta;

export async function twilioDelete(account) {
  if (!account.twilioPhoneNumber) {
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

    if (!phoneNumberId) {
      throw 'ERROR';
    }
    await twilioClient.incomingPhoneNumbers(phoneNumberId).delete();
  } catch (e) {
    console.log(e);
    console.log('Twilio Account Delete Failed');
  }
}

export async function callRailDelete(account) {
  if (!account.callrailId) {
    return null;
  }
  try {
    const deleteCompany = {
      method: 'DELETE',
      url: `https://api.callrail.com/v2/a/${callrails.apiAccount}/companies/${account.callrailId}.json`,
      headers: {
        Authorization: `Token token=${callrails.apiKey}`,
      },
    };

    await axios(deleteCompany);
  } catch (e) {
    console.log(e);
    console.log('Twilio Account Creation Failed');
  }
}

export async function vendastaDelete(account) {
  const accountUrl = `https://api.vendasta.com/api/v3/account/delete/?apiKey=${apiKey}&apiUser=${apiUser}`;
  console.log(account.vendastaAccountId)
  const deleteCompany = {
    accountId: account.vendastaAccountId,
  };
  try {
    await axios.post(accountUrl, deleteCompany);

  } catch (e) {
    console.log(e)
    console.log('Vendasta Account Creation Failed');
  }
}
