
import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import tabConstants from '../components/Chat/consts';

const reducer = '@chat';

export const SET_SELECTED_CHAT = `${reducer}/SET_SELECTED_CHAT`;
export const UPDATE_CHAT_ID = `${reducer}/UPDATE_CHAT_ID`;
export const SET_NEW_CHAT = `${reducer}/SET_NEW_CHAT`;
export const SET_UNREAD_CHATS = `${reducer}/SET_UNREAD_CHATS`;
export const SET_CHAT_MESSAGES = `${reducer}/SET_CHAT_MESSAGES`;
export const SET_LOCKED_CHATS = `${reducer}/SET_LOCKED_CHATS`;
export const SET_CHAT_POC = `${reducer}/SET_CHAT_POC`;
export const SET_TOTAL_CHAT_MESSAGES = `${reducer}/SET_TOTAL_CHAT_MESSAGES`;
export const SET_PATIENT_CHAT = `${reducer}/SET_PATIENT_CHAT`;
export const UNSET_PATIENT_CHAT = `${reducer}/UNSET_PATIENT_CHAT`;

export const setSelectedChat = createAction(SET_SELECTED_CHAT);
export const updateChatId = createAction(UPDATE_CHAT_ID);
export const setNewChat = createAction(SET_NEW_CHAT);
export const setUnreadChats = createAction(SET_UNREAD_CHATS);
export const setChatMessages = createAction(SET_CHAT_MESSAGES);
export const setLockedChats = createAction(SET_LOCKED_CHATS);
export const setChatPoC = createAction(SET_CHAT_POC);
export const setTotalChatMessages = createAction(SET_TOTAL_CHAT_MESSAGES);
export const setPatientChat = createAction(SET_PATIENT_CHAT);
export const unsetPatientChat = createAction(UNSET_PATIENT_CHAT);

export const initialState = Map({
  selectedChatId: null,
  selectedChat: null,
  selectedPatientId: null,
  patientChat: null,
  newChat: null,
  unreadChats: [],
  chatList: {},
  chatMessages: [],
  lockedChats: [],
  isPoC: null,
  chatPoC: null,
  totalChatMessages: 0,
});

export default handleActions(
  {
    [UPDATE_CHAT_ID](state) {
      const selectedChatId =
        (state.get('selectedChat') && state.get('selectedChat').get('id')) || null;
      return state.set('selectedChatId', selectedChatId);
    },

    [SET_SELECTED_CHAT](state, { payload }) {
      return state.set('selectedChat', payload);
    },

    [SET_NEW_CHAT](state, { payload }) {
      return state.set('newChat', payload);
    },

    [SET_UNREAD_CHATS](state, { payload }) {
      return state.set('unreadChats', payload);
    },

    [SET_CHAT_MESSAGES](state, { payload }) {
      return state.set('chatMessages', payload);
    },

    [SET_CHAT_POC](state, { payload }) {
      if (!payload) {
        return state.set('chatPoC', {}).set('isPoC', true);
      }
      if (state.getIn(['selectedChat', 'patientId'])) {
        return state
          .set('chatPoC', payload)
          .set('isPoC', payload.id === state.getIn(['selectedChat', 'patientId']));
      } else if (state.get('newChat') && state.get('newChat').patientId) {
        return state
          .set('chatPoC', payload)
          .set('isPoC', payload.id === state.get('newChat').patientId);
      }

      return state;
    },

    [SET_LOCKED_CHATS](state, { payload }) {
      return state.set('lockedChats', payload);
    },

    [SET_TOTAL_CHAT_MESSAGES](state, { payload }) {
      return state.set('totalChatMessages', payload);
    },
    [SET_PATIENT_CHAT](state, { payload }) {
      return state.set('patientChat', payload);
    },
    [UNSET_PATIENT_CHAT](state) {
      return state.set('patientChat', null);
    },
  },
  initialState,
);

/**
 * Filter chats based on selected tab on chat page.
 * @param chats
 * @param textMessages
 * @param selectedChat
 * @param tabIndex
 * @return {*}
 */
export function filterChatsByTab(chats, textMessages, selectedChat, tabIndex) {
  switch (tabIndex) {
    case tabConstants.UNREAD_TAB:
      return getUnreadChats(chats, textMessages, selectedChat);
    case tabConstants.FLAGGED_TAB:
      return getFlaggedChats(chats);
    default:
      return chats;
  }
}

/**
 * Selector to filter only chats with unread messages.
 * @param chats
 * @param textMessages
 * @param selectedChat
 * @return {*}
 */
export function getUnreadChats(chats, textMessages, selectedChat) {
  return chats.filter(c => c.hasUnread || selectedChat === c.get('id'));
}

/**
 * Selector to filter only flagged chats.
 * @param chats
 * @return {*}
 */
export function getFlaggedChats(chats) {
  return chats.filter(filterChat => filterChat.get('isFlagged'));
}
