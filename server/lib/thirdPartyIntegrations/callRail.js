
import axios from 'axios';
import { statusError } from '@carecru/isomorphic';
import { callrails, fullHostUrl } from '../../config/globals';

const CALL_RAIL_URL = `https://api.callrail.com/v2/a/${callrails.apiAccount}`;
const errorHandling = ({ customMessage, e }) => {
  console.error(customMessage);
  console.error(e);
  throw statusError(e.status, e.data ? e.data.error : e.statusText);
};

function generateCallRailRequestHeaders() {
  return { Authorization: `Token token=${callrails.apiKey}` };
}

function checkForIdExistence(id) {
  if (!id) {
    throw statusError(statusError.NOT_FOUND, 'Account does not have callRail account associated with');
  }
}

async function makeCallRailRequest({ method, url, data, params }) {
  return axios({
    method,
    url,
    headers: generateCallRailRequestHeaders(),
    data,
    params,
    json: true,
  });
}

/**
 * Update the CallRail account company name for a practice account.
 * @throws StatusError
 * @param account
 * @returns {Promise<void>}
 */
export async function updateCompanyName({ name, callrailId }) {
  checkForIdExistence(callrailId);
  try {
    const { data } = await makeCallRailRequest({
      method: 'PUT',
      url: `${CALL_RAIL_URL}/companies/${callrailId}.json`,
      data: { name },
    });

    return data;
  } catch (e) {
    errorHandling({
      customMessage: 'Failed to update the company name for the account',
      e,
    });
  }
}

/**
 * Update the CallRail account phone number for a practice account.
 * The old and the new phone number are required because for one practice,
 * multiple trackers may exist.
 * @throws StatusError
 * @param account
 * @param oldPhoneNumber
 * @param newPhoneNumber
 * @returns {Promise<*>}
 */
export async function updatePhoneNumber(account, oldPhoneNumber, newPhoneNumber) {
  const { callrailId } = account;
  checkForIdExistence(callrailId);
  if (!oldPhoneNumber || !newPhoneNumber) {
    throw statusError(statusError.BAD_REQUEST, 'Please provide both the oldPhoneNumber and the newPhoneNumber');
  }

  try {
    const activeTrackers = await getActiveTrackers(callrailId);
    await Promise.all(activeTrackers
      .filter(({ destination_number }) => destination_number === oldPhoneNumber)
      .map(({ id }) => makeCallRailRequest({
        method: 'PUT',
        url: `${CALL_RAIL_URL}/trackers/${id}.json`,
        data: {
          call_flow: {
            type: 'basic',
            recording_enabled: true,
            destination_number: newPhoneNumber,
          },
        },
      })));

    return exports.getCallRailInformation(account);
  } catch (e) {
    errorHandling({
      customMessage: 'Failed to update the tracking phone number for the account',
      e,
    });
  }
}

/**
 * Retrieve the CallRail information for a practice account.
 * The response will be an JSON object consist of three part: company, trackers, webhooks
 * @throws StatusError
 * @param callrailId
 * @returns {Promise<*>}
 */
export async function getCallRailInformation({ callrailId }) {
  checkForIdExistence(callrailId);
  let company;
  try {
    const data = await makeCallRailRequest({
      method: 'GET',
      url: `${CALL_RAIL_URL}/companies/${callrailId}.json`,
    });

    company = data.data;
  } catch (e) {
    errorHandling({
      customMessage: 'Failed to retrieve Callrail information',
      e,
    });
  }

  if (company.status === 'disabled') {
    throw statusError(statusError.NOT_FOUND, 'The callRail account has been disabled');
  }
  try {
    const activeTrackers = await getActiveTrackers(callrailId);
    const { data: { integrations } } = await makeCallRailRequest({
      method: 'GET',
      url: `${CALL_RAIL_URL}/integrations.json`,
      params: { company_id: callrailId },
    });

    return {
      company,
      trackers: activeTrackers,
      webhooks: integrations,
    };
  } catch (e) {
    errorHandling({
      customMessage: 'Failed to retrieve Callrail information',
      e,
    });
  }
}

/**
 * Disable the CallRail account associated with a practice account.
 * All the features provided by CallRail will be disabled as well.
 * @throws StatusError
 * @param account
 * @returns {Promise<*|void>}
 */
export async function disableCallRailAccount(account) {
  const { callrailId } = account;
  checkForIdExistence(callrailId);

  try {
    await makeCallRailRequest({
      method: 'DELETE',
      url: `${CALL_RAIL_URL}/companies/${callrailId}.json`,
    });

    return account.update({ callrailId: null });
  } catch (e) {
    errorHandling({
      customMessage: 'Failed to delete the callrail account',
      e,
    });
  }
}

/**
 * Create a Company in CallRail for the given account,
 * enable tracker, pre/post call webhooks for the account.
 * @throws StatusError
 * @param account
 * @returns {Promise<*>}
 */
export async function createCallRailAccount(account) {
  const { destinationPhoneNumber, id, name, callrailId } = account;
  if (callrailId) {
    throw statusError(statusError.CONFLICT, 'Account already has the call rail account associated with');
  }
  if (!destinationPhoneNumber) {
    throw statusError(statusError.NOT_FOUND, 'Destination phone number is not provided');
  }

  try {
    const phoneNumber = destinationPhoneNumber.replace(/\s+/g, '');
    const areaCode = destinationPhoneNumber.replace(/\D/g, '').substr(1, 3);
    const company = await makeCallRailRequest({
      method: 'POST',
      url: `${CALL_RAIL_URL}/companies.json`,
      data: { name },
    });
    const createTracker = {
      method: 'POST',
      url: `${CALL_RAIL_URL}/trackers.json`,
      data: {
        name,
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
        source: { type: 'offline' },
      },
    };
    await makeCallRailRequest(createTracker);

    const createWebhook = {
      method: 'POST',
      url: `${CALL_RAIL_URL}/integrations.json`,
      data: {
        company_id: company.data.id,
        type: 'Webhooks',
        config: {
          post_call_webhook: [`${fullHostUrl}/callrail/${id}/inbound/post-call`],
          pre_call_webhook: [`${fullHostUrl}/callrail/${id}/inbound/pre-call`],
        },
      },
    };
    await makeCallRailRequest(createWebhook);

    return account.update({ callrailId: company.data.id });
  } catch (e) {
    errorHandling({
      customMessage: 'Failed to create the callrail account',
      e,
    });
  }
}

async function getActiveTrackers(callrailId) {
  const { data: { trackers } } = await makeCallRailRequest({
    method: 'GET',
    url: `${CALL_RAIL_URL}/trackers.json`,
    params: { company_id: callrailId },
  });

  return trackers.filter(({ status }) => status === 'active');
}
