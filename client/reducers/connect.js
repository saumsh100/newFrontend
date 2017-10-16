
import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

/**
 * Constants
 */
export const SET_IS_SYNCING = 'SET_IS_SYNCING';
export const SET_IS_DONE = 'SET_IS_DONE';
export const SET_PROGRESS = 'SET_PROGRESS';

/**
 * Actions
 */
export const setIsSyncing = createAction(SET_IS_SYNCING);
export const setIsDone = createAction(SET_IS_DONE);
export const setProgress = createAction(SET_PROGRESS);

/**
 * Initial State
 */
export const createInitialConnectState = state => {
  return fromJS(Object.assign({
    isSyncing: true,
    isDone: false,
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

  [SET_IS_DONE](state, { payload }) {
    return state.set('isDone', payload);
  },

  [SET_PROGRESS](state, { payload }) {
    console.log('payload', payload);
    return state.set('progress', payload);
  },
}, initialState);
