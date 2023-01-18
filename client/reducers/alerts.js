import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

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
    [CREATE_ALERT](state, { payload: alertData }) {
      const id = alertData.get('id');
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
