
import axios from 'axios';
import { push } from 'react-router-redux';
import { pullAll, uniq, union } from 'lodash';
import { setSelectedChatId, setUnreadChats, setChatMessages } from '../reducers/chat';
import { fetchEntities, updateEntityRequest, createEntityRequest } from './fetchEntities';
import { deleteAllEntity } from '../actions/entities';
import DesktopNotification from '../util/desktopNotification';

function isOnChatPage() {
  return location.pathname.indexOf('/chat') !== -1;
}

/**
 * defaultSelectedChatId is a function that will determine how to select a chat if there is not already
 * one selected
 *
 * @returns undefined
 */
export function defaultSelectedChatId() {
  return (dispatch, getState) => {
    const { chat, entities } = getState();

    // if it is already defined, leave it alone, its there for a reason
    if (chat.get('selectedChatId')) {
      dispatch(selectChat(chat.get('selectedChatId')));
      return;
    }

    // Because it is not defined, we need to sort the chats and pick the appropriate one
    const chats = entities.getIn(['chats', 'models']);
    const textMessages = entities.getIn(['textMessages', 'models']);
    const sortedChats = chats.sort((a, b) => {
      const aLastId = a.textMessages[a.textMessages.length - 1];
      const aLastTm = textMessages.get(aLastId);
      const bLastId = b.textMessages[b.textMessages.length - 1];
      const bLastTm = textMessages.get(bLastId);
      return new Date(bLastTm.createdAt) - new Date(aLastTm.createdAt);
    });

    const firstChat = sortedChats.first();
    if (firstChat) {
      dispatch(selectChat(firstChat.get('id')));
    }
  };
}

export function loadUnreadMessages() {
  return (dispatch) => {
    const url = '/api/chats/unread?limit=100';
    return axios.get(url)
      .then(result => dispatch(createListOfUnreadedChats(result.data.entities.textMessages || {})));
  };
}

export function addMessage(message) {
  return (dispatch, getState) => {
    const { chat } = getState();
    const selectedChatId = chat.get('selectedChatId');
    dispatch(createListOfUnreadedChats(message.entities.textMessages));

    if (selectedChatId === message.result) {
      dispatch(setChatMessagesListForChat(selectedChatId));

      if (isOnChatPage()) {
        dispatch(markAsRead(selectedChatId));
      }
    }

    if (!isOnChatPage()) {
      const { chats, textMessages, patients } = message.entities;
      const chatId = message.result;
      const conversation = chats[chatId];
      const patientId = conversation.patientId;
      const lastTextMessageId = conversation.textMessages[conversation.textMessages.length - 1];
      const { body } = textMessages[lastTextMessageId];
      const { firstName, lastName } = patients[patientId];
      const messageHeading = `New message from ${firstName} ${lastName}`;

      DesktopNotification.showNotification(messageHeading, {
        body,
        onClick: () => {
          dispatch(push('/chat'));
        },
      });
    }
  };
}

export function createListOfUnreadedChats(result) {
  return (dispatch, getState) => {
    const { chat } = getState();
    const unreadChats = chat.get('unreadChats');
    const selectedChatId = chat.get('selectedChatId');

    if (result === {}) {
      return;
    }

    result = Object.values(result)
      .filter(message =>
        !message.read && shouldUpdateUnreadChats(unreadChats, message.chatId, selectedChatId)
      )
      .map(message => message.id);
    result = uniq(result);
    const newUnreadChatsList = union(unreadChats, result);
    return dispatch(setUnreadChats(newUnreadChatsList));
  };
}

function shouldUpdateUnreadChats(unreadChatsList, unreadChatId, selectedChatId) {
  return !unreadChatsList.includes(unreadChatId) && (!isOnChatPage() || selectedChatId !== unreadChatId);
}

export function loadChatList(limit, skip = 0, url = '/api/chats', join = ['textMessages', 'patient']) {
  return dispatch =>
    dispatch(fetchEntities({
      key: 'chats',
      join,
      params: {
        limit,
        skip,
      },
      url,
    }));
}

export function cleanChatList() {
  return dispatch =>
    dispatch(deleteAllEntity('chats'));
}

export function loadUnreadChatList(limit, skip = 0) {
  return dispatch =>
     dispatch(loadChatList(limit, skip, '/api/chats/unread', ['patient']));
}

export function loadFlaggedChatList(limit, skip = 0) {
  return dispatch =>
     dispatch(loadChatList(limit, skip, '/api/chats/flagged'));
}

export function toggleFlagged(chatId, isFlagged) {
  return dispatch =>
    dispatch(updateEntityRequest({
      key: 'chats',
      values: { isFlagged: !isFlagged },
      url: `/api/chats/${chatId}`,
      merge: true,
    }));
}

export function markAsRead(chatId) {
  return (dispatch, getState) => {
    const { chat } = getState();
    dispatch(updateEntityRequest({
      key: 'textMessages',
      values: {},
      url: `/api/chats/${chatId}/textMessages/read`,
    })).then((response) => {
      const unreadChats = chat.get('unreadChats');
      const listToRemove = Object.keys(response.textMessages);

      pullAll(unreadChats, listToRemove);
      dispatch(setUnreadChats(unreadChats));
    });
  };
}

export function setChatMessagesListForChat(chatId) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const allMessages = entities.getIn(['textMessages', 'models']);
    const filteredChatMessages = allMessages.filter(message => message.chatId === chatId)
                       .sort((messageOne, messageTwo) =>
                          new Date(messageOne.createdAt) - new Date(messageTwo.createdAt)
                       );

    return dispatch(setChatMessages(filteredChatMessages || []));
  };
}

export function selectChat(id) {
  return (dispatch) => {
    dispatch(setSelectedChatId(id));
    if (id) {
      dispatch(markAsRead(id));
    }
    dispatch(setChatMessagesListForChat(id));
  };
}

export function createNewChat(entityData) {
  return dispatch =>
    dispatch(createEntityRequest({
      key: 'chats',
      entityData,
      url: '/api/chats',
    }));
}

export function sendChatMessage(entityData) {
  return dispatch =>
    dispatch(createEntityRequest({
      key: 'chats',
      entityData,
      url: '/api/chats/textMessages',
    }));
}
