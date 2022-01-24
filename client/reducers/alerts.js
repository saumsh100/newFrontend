import { Map } from 'immutable';
import { v4 as uuid } from 'uuid';
import { createAction, handleActions } from 'redux-actions';
import Alert from '../entities/models/Alert';
import DesktopNotification from '../util/desktopNotification';

const reducer = '@alerts';

/**
 * Constants
 */
export const CREATE_ALERT = `${reducer}/CREATE_ALERT`;
export const REMOVE_ALERT = `${reducer}/REMOVE_ALERT`;

/**
 * Actions
 */
export const createAlert = createAction(CREATE_ALERT);
export const removeAlert = createAction(REMOVE_ALERT);

/**
 * Initial State
 */
export const initialState = Map({});

export default handleActions(
  {
    [CREATE_ALERT](state, { payload: { alert, type } }) {
      const title = alert.title || (type === 'success' ? 'Success' : 'Error');
      const id = alert.id || uuid();
      const alertData = new Alert({
        id,
        title,
        body: alert.body,
        subText: alert.subText || '',
        type,
        caller: alert.caller || false,
        time: 1000,
        sticky: alert.sticky || false,
        browserAlert: alert.browserAlert || false,
        clickable: alert.clickable || false,
      });

      if (alert.browserAlert) {
        DesktopNotification.showNotification(title, { body: alert.body });
      }

      return state.set(id, alertData);
    },

    [REMOVE_ALERT](
      state,
      {
        payload: {
          alert: { id },
        },
      },
    ) {
      return state.delete(id);
    },
  },
  initialState,
);
