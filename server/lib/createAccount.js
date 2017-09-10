import request from 'request-promise';
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
}

async function twilioSetup(account) {
  // Right now default to Canada numbers. Maybe add a country dropdown in account creation.
  if (!account.destinationPhoneNumber) {
    return null;
  }

  const areaCode = account.destinationPhoneNumber.replace(/\D/g, '').substr(1, 3);
  const data = await twilioClient.availablePhoneNumbers('CA').local.list({
    areaCode,
    smsEnabled: true,
    voiceEnabled: true,
  });

  const number = data.availablePhoneNumbers[0];
  await twilioClient.incomingPhoneNumbers.create({
    phoneNumber: number.phone_number,
    friendlyName: account.name,
    smsUrl: `https://carecru.io/twilio/sms/accounts/${account.id}`,
  });
  return number.phone_number;
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
      country: account.country ,
      state: account.state,
      zip: account.zipCode,
  };
  try {
    const newCompany = await axios.post(accountUrl, createCompany);

    return {
      vendastaId: customerIdentifier,
      vendastaAccountId: newCompany.data.accountId,
    };
  } catch (e) {
    console.log(e);
    return {};
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

  if (reputationManagement === 'true' || listings === 'true' || social === 'true') {
    vendastaData = await vendastaSetup(account, setupList);
  }

  const data = {
    callrailId: callTracking === 'true' ? await callRail(account) : null,
    twilioPhoneNumber: (canSendReminders === 'true' || canSendRecalls === 'true') ? await twilioSetup(account) : null,
    ...vendastaData,
  };

  return data;
}
