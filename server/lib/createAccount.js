import { callrails, vendasta } from '../config/globals';
import twilioClient from '../config/twilio';
const axios = require('axios');

const uuid = require('uuid').v4;

const {
  apiKey,
  apiUser,
} = vendasta;

async function callRail(account) {
  if (!account.destinationPhoneNumber) {
    return null;
  }

  try {

    const phoneNumber = account.destinationPhoneNumber.replace(/\s+/g, '');
    const areaCode = account.destinationPhoneNumber.replace(/\D/g, '').substr(1, 3);

    const createCompany = {
      method: 'POST',
      url: `https://api.callrail.com/v2/a/${callrails.apiAccount}/companies.json`,
      headers: {
        Authorization: `Token token=${callrails.apiKey}`,
      },
      data: {
        name: account.name,
      },
      json: true,
    };

    const company = await axios(createCompany);
    const createTracker = {
      method: 'POST',
      url: `https://api.callrail.com/v2/a/${callrails.apiAccount}/trackers.json`,
      headers: {
        Authorization: `Token token=${callrails.apiKey}`,
      },
      data: {
        name: account.name,
        type: 'source',
        company_id: company.data.id,
        call_flow: {
          type: 'basic',
          recording_enabled: true,
          destination_number: phoneNumber,
        },
        tracking_number: {
          area_code: areaCode,
          local: phoneNumber,
        },
        source: {
          type: 'offline',
        },
      },
      json: true,
    };
    await axios(createTracker);

    const createWebhook = {
      method: 'POST',
      url: `https://api.callrail.com/v2/a/${callrails.apiAccount}/integrations.json`,
      headers: {
        Authorization: `Token token=${callrails.apiKey}`,
      },
      data: {
        company_id: company.data.id,
        type: 'Webhooks',
        config: {
          post_call_webhook: [`https://carecru.io/callrail/${account.id}/inbound/post-call`],
          pre_call_webhook: [`https://carecru.io/callrail/${account.id}/inbound/pre-call`],
        },
      },
      json: true,
    };

    await axios(createWebhook);

    return company.data.id;
  } catch (e) {
    console.log('Call Rail Account Creation Failed');
  }
}

async function twilioSetup(account) {
  // Right now default to Canada numbers. Maybe add a country dropdown in account creation.
  if (!account.destinationPhoneNumber) {
    return null;
  }
  try {
    const data = await twilioClient.availablePhoneNumbers('CA').local.list({
      smsEnabled: true,
      voiceEnabled: true,
      inRegion: account.state,
    });
    const number = data.availablePhoneNumbers[0];
    await twilioClient.incomingPhoneNumbers.create({
      phoneNumber: number.phone_number,
      friendlyName: account.name,
      smsUrl: `https://carecru.io/twilio/sms/accounts/${account.id}`,
    });
    return number.phone_number;
  } catch (e) {
    console.log(e);
    console.log('Twilio Account Creation Failed');
  }
}

async function vendastaSetup(account, setupList) {
  const accountUrl = `https://api.vendasta.com/api/v3/account/create/?apiKey=${apiKey}&apiUser=${apiUser}`;
  const customerIdentifier = uuid();
  const createCompany = {
    companyName: account.name,
    customerIdentifier,
    addPresenceBuilderFlag: setupList.listings,
    addReputationFlag: setupList.reputationManagement,
    addSocialMarketingFlag: setupList.social,
    address: account.street,
    city: account.city,
    country: account.country,
    state: account.state,
    zip: account.zipCode,
  };
  try {
    const newCompany = await axios.post(accountUrl, createCompany);

    const accountUrlGet = `https://api.vendasta.com/api/v3/account/get/?apiKey=${apiKey}&apiUser=${apiUser}&accountId=${newCompany.data.data.accountId}`;

    const product = await axios.get(accountUrlGet);

    const srid = product.data.data.productsJson.RM ? product.data.data.productsJson.RM.productId : null;
    const msid = product.data.data.productsJson.MS ? product.data.data.productsJson.MS.productId : null;
    const smid = product.data.data.productsJson.SM ? product.data.data.productsJson.SM.productId : null;

    return {
      vendastaId: customerIdentifier,
      vendastaAccountId: newCompany.data.data.accountId,
      vendastaMsId: msid,
      vendastaSmId: smid,
      vendastaSrId: srid,
    };
  } catch (e) {
    console.log(e)
    console.log('Vendasta Account Creation Failed');
  }
}

export default async function createAccount(account, setupList) {
  const {
    listings,
    reputationManagement,
    social,
    callTracking,
    canSendReminders,
    canSendRecalls,
  } = setupList;

  let vendastaData = null;
  let callrailId = null;
  let twilioPhoneNumber = null;

  try {
    if (canSendReminders === 'true' || canSendRecalls === 'true') {
      twilioPhoneNumber = await twilioSetup(account);
    }
    if (callTracking === 'true') {
      callrailId = await callRail(account);
    }

    if (reputationManagement === 'true' || listings === 'true' || social === 'true') {
      vendastaData = await vendastaSetup(account, setupList);
    }

  } catch (e) {
    console.log(e);
  }

  const data = {
    callrailId,
    twilioPhoneNumber,
    ...vendastaData,
  };

  return data;

}
