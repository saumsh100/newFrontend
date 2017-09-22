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
  const accountUrl = `https://api.vendasta.com/api/v3/account/get/?apiKey=${apiKey}&apiUser=${apiUser}&accountId=${account.vendastaAccountId}`;
  const accountUrl2 = `https://presence-builder-api.vendasta.com/api/v3/site/delete/?apiKey=${apiKey}&apiUser=${apiUser}`;
  console.log(account.vendastaAccountId)
  // const deleteCompany = {
  //   accountId: account.vendastaAccountId,
  // };
  try {
    const test = await axios.get(accountUrl);
    console.log(test.data.data.productsJson);

    const deleteCompany = {
      msid: test.data.data.productsJson.MS.productId,
    };

    // await axios.post(accountUrl2, deleteCompany);

  } catch (e) {
    console.log(e)
    console.log('Vendasta Account Creation Failed');
  }
}
