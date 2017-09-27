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
      }
    }

    if (!phoneNumberId) {
      throw 'ERROR PHONE NUMBER NOT FOUND';
    }
    await twilioClient.incomingPhoneNumbers(phoneNumberId).delete();
    const newAccount = await account.update({ twilioPhoneNumber: null });

    return newAccount;
  } catch (e) {
    console.log(e);
    console.log('Twilio Account Delete Failed');
    return account;
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

    const newAccount = await account.update({ callrailId: null });
    return newAccount;
  } catch (e) {
    console.log(e);
    console.log('Twilio Account Creation Failed');
    return account;
  }
}

async function vendastaDeleteMS(account) {
  const accountUrl = `https://presence-builder-api.vendasta.com/api/v3/site/delete/?apiKey=${apiKey}&apiUser=${apiUser}`;

  try {
    const deleteCompany = {
      msid: account.vendastaMsId,
    };

    await axios.post(accountUrl, deleteCompany);

    return await account.update({
      vendastaMsId: null,
    });
  } catch (e) {
    console.log(e);
    console.log('Vendasta Account Creation Failed');
    return account;
  }
}

async function vendastaDeleteRM(account) {
  const accountUrl = `https://reputation-intelligence-api.vendasta.com/api/v2/account/delete/?apiKey=${apiKey}&apiUser=${apiUser}`;

  try {
    const deleteCompany = {
      srid: account.vendastaSrId,
    };

    await axios.post(accountUrl, deleteCompany);

    return await account.update({
      vendastaSrId: null,
    });
  } catch (e) {
    console.log(e);
    console.log('Vendasta Account Creation Failed');
    return account;
  }
}

export async function vendastaDelete(account, options) {
  try {
    if (options.options === 'deleteAll') {
      return await vendastaDeleteAll(account);
    } else if (options.options === 'delete') {
      let newAccount = account;

      if (options.listings) {
        newAccount = await vendastaDeleteMS(account);
      }

      if (options.reputationManagement) {
        newAccount = await vendastaDeleteRM(account);
      }

      return newAccount;
    }

    return account;
  } catch (e) {
    console.log(e);
    console.log('Vendasta Account Creation Failed');
    return account;
  }
}

async function vendastaDeleteAll(account) {
  const accountUrl = `https://api.vendasta.com/api/v3/account/delete/?apiKey=${apiKey}&apiUser=${apiUser}`;

  const deleteCompany = {
    accountId: account.vendastaAccountId,
  };
  try {
    await axios.post(accountUrl, deleteCompany);

    return await account.update({
      vendastaMsId: null,
      vendastaSrId: null,
      vendastaAccountId: null,
    });
  } catch (e) {
    console.log(e);
    console.log('Vendasta Account Creation Failed');
    return account;
  }
}
