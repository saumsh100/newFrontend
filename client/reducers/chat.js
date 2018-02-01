
import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

export const SET_SELECTED_CHAT_ID = '@chat/SET_SELECTED_CHAT_ID';
export const SET_NEW_CHAT = '@chat/SET_NEW_CHAT';
export const MERGE_NEW_CHAT = '@chat/MERGE_NEW_CHAT';

export const setSelectedChatId = createAction(SET_SELECTED_CHAT_ID);
export const setNewChat = createAction(SET_NEW_CHAT);
export const mergeNewChat = createAction(MERGE_NEW_CHAT);

export const initialState = Map({
  selectedChatId: null,
  newChat: null,
});

export default handleActions({
  [SET_SELECTED_CHAT_ID](state, { payload }) {
    return state.set('selectedChatId', payload);
  },

  [SET_NEW_CHAT](state, { payload }) {
    return state.set('newChat', payload);
  },

  [MERGE_NEW_CHAT](state, { payload }) {
    const newChat = state.get('newChat') || {};
    return state.set('newChat', Object.assign({}, newChat, payload));
  },
}, initialState);


