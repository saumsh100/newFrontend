
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';

export const SET_SELECTED_CALL_ID = 'SET_SELECTED_CALL_ID';
export const UNSET_SELECTED_CALL_ID = 'UNSET_SELECTED_CALL_ID';

export const initialState = Map({
  callerId: null,
});

export default handleActions(
  {
    [SET_SELECTED_CALL_ID](state, { payload }) {
      return state.set('callerId', payload);
    },

    [UNSET_SELECTED_CALL_ID](state) {
      return state.set('callerId', null);
    },
  },
  initialState,
);
