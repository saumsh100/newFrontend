
import { httpClient } from '../util/httpClient';
import { showAlertTimeout } from './alerts';
import {
  setIsFetchingWaitingRoomQueue,
  setWaitingRoomQueue,
  setDefaultTemplate,
  updateWaitingRoomPatient,
  removeWaitingRoomPatient,
} from '../reducers/waitingRoom';

/**
 * fetchWaitingRoomQueue is a thunk that will fetch the waiting room queue for a
 * given practice
 *
 * @param accountId
 * @returns async function
 */
export function fetchWaitingRoomQueue({ accountId }) {
  return async (dispatch) => {
    dispatch(setIsFetchingWaitingRoomQueue(true));

    try {
      const { data } = await httpClient().get('/api/waitingRoom', {
        params: { accountId },
      });

      dispatch(setWaitingRoomQueue(data));
    } catch (err) {
      console.error(`Failed to fetch waiting room queue: ${err}`);
    }

    dispatch(setIsFetchingWaitingRoomQueue(false));
  };
}

/**
 * fetchWaitingRoomNotificationTemplate is a thunk that will fetch the default waiting room
 * notification message for a given practice
 *
 * @param accountId
 * @returns async function
 */
export function fetchWaitingRoomNotificationTemplate({ accountId }) {
  return async (dispatch) => {
    try {
      const url =
        `/api/accounts/${accountId}/renderedTemplate` +
        '?templateName=practice-ready-for-patient-message';

      const { data } = await httpClient().get(url);

      dispatch(setDefaultTemplate(data));
    } catch (err) {
      console.error(`Error fetching waiting room notification template ${err}`);
      dispatch(setDefaultTemplate('ERROR FETCHING TEMPLATE'));
    }
  };
}

/**
 * sendWaitingRoomNotification is a thunk (although not currently modifying redux state) that
 * will send the supplied message to the selected patient in the waiting room queue
 *
 * @param waitingRoomPatient
 * @param message
 * @returns async function
 */
export function sendWaitingRoomNotification({ waitingRoomPatient, message, alert }) {
  return async (dispatch) => {
    try {
      const { id } = waitingRoomPatient;
      const { data: sentWaitingRoomNotification } = await httpClient().post(
        `/api/waitingRoom/${id}/notify`,
        { message },
      );

      // Needed in case the socket fails
      dispatch(
        updateWaitingRoomPatient({
          ...waitingRoomPatient,
          sentWaitingRoomNotifications: [
            ...waitingRoomPatient.sentWaitingRoomNotifications,
            sentWaitingRoomNotification,
          ],
        }),
      );

      alert &&
        alert.success &&
        dispatch(
          showAlertTimeout({
            alert: alert.success,
            type: 'success',
          }),
        );
    } catch (err) {
      console.error(`Error sending waiting room notification to patient ${err}`);

      alert &&
        alert.error &&
        dispatch(
          showAlertTimeout({
            alert: alert.error,
            type: 'error',
          }),
        );
    }
  };
}

/**
 * cleanWaitingRoomPatient is a thunk (although not currently modifying redux state) that
 * will mark a waiting room entry as "cleaned" or "not cleaned"
 *
 * @param isCleaned
 * @param waitingRoomPatient
 * @returns async function
 */
export function cleanWaitingRoomPatient({ isCleaned, waitingRoomPatient, alert }) {
  return async (dispatch) => {
    try {
      const { id } = waitingRoomPatient;
      const { data: newWaitingRoomPatient } = await httpClient().post(
        `/api/waitingRoom/${id}/clean`,
        { isCleaned },
      );

      // Needed in case the socket fails
      dispatch(
        updateWaitingRoomPatient({
          id,
          cleanedAt: newWaitingRoomPatient.cleanedAt,
          cleanedByUserId: newWaitingRoomPatient.cleanedByUserId,
        }),
      );

      alert &&
        alert.success &&
        dispatch(
          showAlertTimeout({
            alert: alert.success,
            type: 'success',
          }),
        );
    } catch (err) {
      console.error(`Error updating waiting room to isCleaned=${isCleaned} ${err}`);

      alert &&
        alert.error &&
        dispatch(
          showAlertTimeout({
            alert: alert.error,
            type: 'error',
          }),
        );
    }
  };
}

/**
 * completeWaitingRoomPatient is a thunk (although not currently modifying redux state) that
 * will mark a waiting room entry as "completed" or "not completed"
 *
 * @param isCompleted
 * @param waitingRoomPatient
 * @returns async function
 */
export function completeWaitingRoomPatient({ isCompleted, waitingRoomPatient, alert }) {
  return async (dispatch) => {
    try {
      const { id } = waitingRoomPatient;
      await httpClient().post(`/api/waitingRoom/${id}/complete`, {
        isCompleted,
      });

      dispatch(removeWaitingRoomPatient(id));
      alert &&
        alert.success &&
        dispatch(
          showAlertTimeout({
            alert: alert.success,
            type: 'success',
          }),
        );
    } catch (err) {
      console.error(`Error updating waiting room to isCompleted=${isCompleted} ${err}`);

      alert &&
        alert.error &&
        dispatch(
          showAlertTimeout({
            alert: alert.error,
            type: 'error',
          }),
        );
    }
  };
}
