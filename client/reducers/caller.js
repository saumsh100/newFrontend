
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

export const SET_SELECTED_CALL_ID = 'SET_SELECTED_CALL_ID';
export const UNSET_SELECTED_CALL_ID = 'UNSET_SELECTED_CALL_ID';

const initialState = fromJS({
  callerId: null,
});

export default handleActions({
  [SET_SELECTED_CALL_ID](state, { payload }) {
    const id = payload;
    return state.set('callerId', id);
  },

  [UNSET_SELECTED_CALL_ID](state) {
    return state.set('callerId', null);
  },

}, initialState);
