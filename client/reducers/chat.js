
import { Map } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import tabConstants from '../components/Chat/consts';

const reducer = '@chat';

export const ADD_PENDING_MESSAGE = `${reducer}/ADD_PENDING_MESSAGE`;
export const PRUNE_PENDING_MESSAGES = `${reducer}/PRUNE_PENDING_MESSAGES`;
export const SET_SELECTED_CHAT = `${reducer}/SET_SELECTED_CHAT`;
export const UPDATE_CHAT_ID = `${reducer}/UPDATE_CHAT_ID`;
export const SET_NEW_CHAT = `${reducer}/SET_NEW_CHAT`;
export const SET_CHAT_IS_LOADING = `${reducer}/SET_CHAT_IS_LOADING`;
export const SET_CONVERSATION_IS_LOADING = `${reducer}/SET_CONVERSATION_IS_LOADING`;
export const SET_UNREAD_CHATS = `${reducer}/SET_UNREAD_CHATS`;
export const SET_UNREAD_CHATS_COUNT = `${reducer}/SET_UNREAD_CHATS_COUNT`;
export const SET_CHAT_MESSAGES = `${reducer}/SET_CHAT_MESSAGES`;
export const SET_LOCKED_CHATS = `${reducer}/SET_LOCKED_CHATS`;
export const SET_CHAT_POC = `${reducer}/SET_CHAT_POC`;
export const SET_TOTAL_CHAT_MESSAGES = `${reducer}/SET_TOTAL_CHAT_MESSAGES`;
export const SET_PATIENT_CHAT = `${reducer}/SET_PATIENT_CHAT`;
export const UNSET_PATIENT_CHAT = `${reducer}/UNSET_PATIENT_CHAT`;
export const SET_CHAT_PLACEHOLDERS = `${reducer}/SET_CHAT_PLACEHOLDERS`;
export const SET_CHAT_CATEGORIES_COUNT = `${reducer}/SET_CHAT_CATEGORIES_COUNT`;
export const SET_IS_FETCHING_PROSPECT = `${reducer}/SET_IS_FETCHING_PROSPECT`;
export const SET_PROSPECT = `${reducer}/SET_PROSPECT`;

export const addPendingMessage = createAction(ADD_PENDING_MESSAGE);
export const prunePendingMessages = createAction(PRUNE_PENDING_MESSAGES);
export const setSelectedChat = createAction(SET_SELECTED_CHAT);
export const updateChatId = createAction(UPDATE_CHAT_ID);
export const setNewChat = createAction(SET_NEW_CHAT);
export const setChatIsLoading = createAction(SET_CHAT_IS_LOADING);
export const setConversationIsLoading = createAction(SET_CONVERSATION_IS_LOADING);
export const setUnreadChats = createAction(SET_UNREAD_CHATS);
export const setUnreadChatsCount = createAction(SET_UNREAD_CHATS_COUNT);
export const setChatMessages = createAction(SET_CHAT_MESSAGES);
export const setLockedChats = createAction(SET_LOCKED_CHATS);
export const setChatPoC = createAction(SET_CHAT_POC);
export const setTotalChatMessages = createAction(SET_TOTAL_CHAT_MESSAGES);
export const setPatientChat = createAction(SET_PATIENT_CHAT);
export const unsetPatientChat = createAction(UNSET_PATIENT_CHAT);
export const setChatCategoriesCount = createAction(SET_CHAT_CATEGORIES_COUNT);
export const setIsFetchingProspect = createAction(SET_IS_FETCHING_PROSPECT);
export const setProspect = createAction(SET_PROSPECT);

export const initialState = Map({
  selectedChatId: null,
  selectedChat: null,
  selectedPatientId: null,
  patientChat: null,
  newChat: null,
  unreadChats: [],
  unreadChatsCount: 0,
  chatList: {},
  chatMessages: [],
  lockedChats: [],
  isPoC: null,
  chatPoC: null,
  totalChatMessages: 0,
  chatCategoriesCount: {},
  isFetchingProspect: false,
  isLoading: true,
  conversationIsLoading: false,
  pendingMessages: [],
  prospect: null,
});

export default handleActions(
  {
    [ADD_PENDING_MESSAGE](state, { payload }) {
      return state.set('pendingMessages', [...state.get('pendingMessages'), payload]);
    },

    [PRUNE_PENDING_MESSAGES](state) {
      return state.set('pendingMessages', []);
    },

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

    [SET_CHAT_IS_LOADING](state, { payload }) {
      return state.set('isLoading', payload);
    },

    [SET_CONVERSATION_IS_LOADING](state, { payload }) {
      return state.set('conversationIsLoading', payload);
    },

    [SET_UNREAD_CHATS](state, { payload }) {
      return state.set('unreadChats', payload);
    },

    [SET_UNREAD_CHATS_COUNT](state, { payload }) {
      return state.set('unreadChatsCount', payload);
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

    [SET_CHAT_CATEGORIES_COUNT](state, { payload }) {
      return state.set('chatCategoriesCount', payload);
    },

    [SET_IS_FETCHING_PROSPECT](state, { payload }) {
      return state.set('isFetchingProspect', payload);
    },

    [SET_PROSPECT](state, { payload }) {
      return state.set('prospect', payload);
    },
  },
  initialState,
);

/**
 * Filter chats based on selected tab on chat page.
 * @param chats
 * @param selectedChat
 * @param tabIndex
 * @return {*}
 */
export function filterChatsByTab(chats, selectedChat, tabIndex) {
  switch (tabIndex) {
    case tabConstants.UNREAD_TAB:
      return getUnreadChats(chats, selectedChat);
    case tabConstants.FLAGGED_TAB:
      return getFlaggedChats(chats);
    case tabConstants.OPEN_TAB:
      return getOpenChats(chats);
    case tabConstants.CLOSED_TAB:
      return getClosedChats(chats);
    default:
      return chats;
  }
}

/**
 * Selector to filter only chats with unread messages.
 * @param chats
 * @param selectedChat
 * @return {*}
 */
export function getUnreadChats(chats, selectedChat) {
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

/**
 * Filter for open chats
 * @param chats
 * @return {*}
 */
export function getOpenChats(chats) {
  return chats.filter(filterChat => filterChat.get('isOpen'));
}

/**
 * Filter for closed chats
 * @param chats
 * @return {*}
 */
export function getClosedChats(chats) {
  return chats.filter(filterChat => !filterChat.get('isOpen'));
}
