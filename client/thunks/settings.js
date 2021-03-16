
import { normalizePhone } from '../util/isomorphic';
import { createEntityRequest, deleteEntityRequest } from './fetchEntities';
import { receiveEntities } from '../reducers/entities';
import { httpClient } from '../util/httpClient';
import { showAlertTimeout } from './alerts';
import { parseDate } from '../components/library';

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
    dispatch(
      createEntityRequest({
        id,
        url: `/twilio/setup/${id}/twilioPhoneNumber`,
        key: 'accounts',
        alert: generateAlert('Twilio Phone Number'),
      }),
    );
}

export function removeTwilioNumber(id) {
  return async (dispatch) => {
    const accountWithRemovedValue = await dispatch(
      deleteEntityRequest({
        key: 'accounts',
        url: `/twilio/setup/${id}/twilioPhoneNumber`,
        alert: removeAlert('Twilio Phone Number'),
      }),
    );
    return dispatch(
      receiveEntities({
        key: 'accounts',
        entities: accountWithRemovedValue.entities,
      }),
    );
  };
}

export function generateCallRailKey(id) {
  return dispatch =>
    dispatch(
      createEntityRequest({
        id,
        url: `/callrail/${id}`,
        key: 'accounts',
        alert: generateAlert('CallRail ID'),
      }),
    );
}

export function removeCallRailKey(id) {
  return async (dispatch) => {
    const accountWithRemovedValue = await dispatch(
      deleteEntityRequest({
        key: 'accounts',
        url: `/callrail/${id}`,
        alert: removeAlert('CallRail ID'),
      }),
    );
    return dispatch(
      receiveEntities({
        key: 'accounts',
        entities: accountWithRemovedValue.entities,
      }),
    );
  };
}

export function generateVendastaKey(id) {
  return dispatch =>
    dispatch(
      createEntityRequest({
        key: 'accounts',
        url: `/vendasta/${id}`,
        id,
        alert: generateAlert('Vendasta key'),
      }),
    );
}

export function deleteVendastaKey(id) {
  return async (dispatch) => {
    const withDeletedValue = await dispatch(
      deleteEntityRequest({
        key: 'accounts',
        url: `/vendasta/${id}`,
        alert: removeAlert('Vendasta key'),
      }),
    );
    return dispatch(
      receiveEntities({
        key: 'accounts',
        entities: withDeletedValue.entities,
      }),
    );
  };
}

export const sendReminderPreviewCall = ({
  accountId,
  status,
  cellPhoneNumber,
  timezone,
  amount,
  unit,
  callback,
}) =>
  async function (dispatch) {
    try {
      return await httpClient()
        .get(`/api/accounts/${accountId}/voice/preview`, {
          params: {
            binName: `reminder-voice-${status}`,
            cellPhoneNumber,
            startDateTime: parseDate(new Date(), timezone)
              .add(amount, unit)
              .toISOString(),
          },
        })
        .then(() => {
          dispatch(
            showAlertTimeout({
              alert: { body: `Test call sent to ${normalizePhone(cellPhoneNumber)}` },
              type: 'success',
            }),
          );
          callback();
        });
    } catch (err) {
      console.error(err);
      dispatch(
        showAlertTimeout({
          alert: { body: 'Test call failed' },
          type: 'error',
        }),
      );
    }
  };
