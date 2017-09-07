import request from 'request-promise';
import { callrails, vendasta } from '../config/globals';
import twilioClient from '../config/twilio';

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
    uri: `https://api.callrail.com/v2/a/${callrails.apiAccount}/companies.json`,
    headers: {
      Authorization: `Token token=${callrails.apiKey}`,
    },
    body: {
      name: account.name,
    },
    json: true,
  };

  const company = await request(createCompany);

  const createTracker = {
    method: 'POST',
    uri: `https://api.callrail.com/v2/a/${callrails.apiAccount}/trackers.json`,
    headers: {
      Authorization: `Token token=${callrails.apiKey}`,
    },
    body: {
      name: account.name,
      type: 'source',
      company_id: company.id,
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
  await request(createTracker);

  const createWebhook = {
    method: 'POST',
    uri: `https://api.callrail.com/v2/a/${callrails.apiAccount}/integrations.json`,
    headers: {
      Authorization: `Token token=${callrails.apiKey}`,
    },
    body: {
      company_id: company.id,
      type: 'Webhooks',
      config: {
        post_call_webhook: [`https://carecru.io/callrail/${account.id}/inbound/post-call`],
        pre_call_webhook: [`https://carecru.io/callrail/${account.id}/inbound/pre-call`],
      },
    },
    json: true,
  };

  await request(createWebhook);

  return company.id;
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

async function vendastaSetup(account) {
  const accountUrl = `https://api.vendasta.com/api/v3/account/create/?apiKey=${apiKey}&apiUser=${apiUser}`;
  const customerIdentifier = uuid();
  const createCompany = {
    method: 'POST',
    uri: accountUrl,
    body: {
      companyName: account.name,
      customerIdentifier,
    },
    json: true,
  };
  try {
    const newCompany = await request(createCompany);
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
  const vendastaData = setupList.reputationManagement ? await vendastaSetup(account) : null;

  const data = {
    callrailId: setupList.callTracking ? await callRail(account) : null,
    twilioPhoneNumber: (setupList.canSendReminders || setupList.canSendRecalls) ? await twilioSetup(account) : null,
    ...vendastaData,
  };
  return data;
}
