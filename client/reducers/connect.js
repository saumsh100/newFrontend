
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/**
 * Constants
 */
export const SET_IS_SYNCING = 'SET_IS_SYNCING';
export const SET_PROGRESS = 'SET_PROGRESS';

/**
 * Actions
 */
export const setIsSyncing = createAction(SET_IS_SYNCING);
export const setProgress = createAction(SET_PROGRESS);

/**
 * Initial State
 */
export const createInitialConnectState = state => {
  return fromJS(Object.assign({
    isSyncing: false,
    progress: null,
  }, state));
};

export const initialState = createInitialConnectState();

/**
 * Reducer
 */
export default handleActions({
  [SET_IS_SYNCING](state, { payload }) {
    return state.set('isSyncing', payload);
  },

  [SET_PROGRESS](state, { payload }) {
    return state.set('progress', payload);
  },
}, initialState);
