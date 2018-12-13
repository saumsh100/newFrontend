
import { createEntityRequest, deleteEntityRequest } from './fetchEntities';
import { receiveEntities } from '../reducers/entities';

const generateAlert = field => ({
  success: { body: `Successfully generated ${field}.` },
  error: {
    title: 'Practice Information Error',
    body: `Failed to generate ${field}.`,
  },
});
const removeAlert = field => ({
  success: { body: `Successfully removed ${field}.` },
  error: {
    title: 'Practice Information Error',
    body: `Failed to remove ${field}.`,
  },
});

export function generateTwilioNumber(id) {
  return dispatch =>
    dispatch(createEntityRequest({
      id,
      url: `/twilio/setup/${id}/twilioPhoneNumber`,
      key: 'accounts',
      alert: generateAlert('Twilio Phone Number'),
    }));
}

export function removeTwilioNumber(id) {
  return async (dispatch) => {
    const accountWithRemovedValue = await dispatch(deleteEntityRequest({
      key: 'accounts',
      url: `/twilio/setup/${id}/twilioPhoneNumber`,
      alert: removeAlert('Twilio Phone Number'),
    }));
    return dispatch(receiveEntities({
      key: 'accounts',
      entities: accountWithRemovedValue.entities,
    }));
  };
}

export function generateCallRailKey(id) {
  return dispatch =>
    dispatch(createEntityRequest({
      id,
      url: `/_callrail/${id}`,
      key: 'accounts',
      alert: generateAlert('CallRail ID'),
    }));
}

export function removeCallRailKey(id) {
  return async (dispatch) => {
    const accountWithRemovedValue = await dispatch(deleteEntityRequest({
      key: 'accounts',
      url: `/_callrail/${id}`,
      alert: removeAlert('CallRail ID'),
    }));
    return dispatch(receiveEntities({
      key: 'accounts',
      entities: accountWithRemovedValue.entities,
    }));
  };
}

export function generateVendastaKey(id) {
  return dispatch =>
    dispatch(createEntityRequest({
      key: 'accounts',
      url: `/_vendasta/${id}`,
      id,
      alert: generateAlert('Vendasta key'),
    }));
}

export function deleteVendastaKey(id) {
  return async (dispatch) => {
    const withDeletedValue = await dispatch(deleteEntityRequest({
      key: 'accounts',
      url: `/_vendasta/${id}`,
      alert: removeAlert('Vendasta key'),
    }));
    return dispatch(receiveEntities({
      key: 'accounts',
      entities: withDeletedValue.entities,
    }));
  };
}
