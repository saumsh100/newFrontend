
import axios from 'axios';
import { push } from 'react-router-redux';
import { pull, pullAll, uniq, union, without } from 'lodash';
import {
  setSelectedChatId,
  setUnreadChats,
  setChatMessages,
  setLockedChats,
} from '../reducers/chat';
import { fetchEntities, updateEntityRequest, createEntityRequest } from './fetchEntities';
import DesktopNotification from '../util/desktopNotification';
import { deleteAllEntity, receiveEntities } from '../actions/entities';
import { isHub } from '../util/hub';

function isOnChatPage(currentPath) {
  return currentPath.indexOf('/chat') !== -1;
}

/**
 * defaultSelectedChatId is a function that will determine how to
 * select a chat if there is not already
 *
 * one selected
 *
 * @returns undefined
 */
export function defaultSelectedChatId() {
  return (dispatch, getState) => {
    const { chat, entities } = getState();

    if (isHub()) {
      return;
    }

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
    return axios
      .get(url)
      .then(result => dispatch(createListOfUnreadedChats(result.data.entities.textMessages || {})));
  };
}

export function addMessage(message) {
  return (dispatch, getState) => {
    const { chat, electron, routing } = getState();
    const selectedChatId = chat.get('selectedChatId');
    const chatPageActive =
      isOnChatPage(routing.location.pathname) && (!isHub() || electron.get('showContent'));
    dispatch(createListOfUnreadedChats(message.entities.textMessages));

    if (selectedChatId === message.result) {
      dispatch(setChatMessagesListForChat(selectedChatId));

      if (chatPageActive) {
        dispatch(markAsRead(selectedChatId));
      }
    }

    if (!chatPageActive) {
      const { chats, textMessages, patients } = message.entities;
      const chatId = message.result;
      const conversation = chats[chatId];
      const patientId = conversation.patientId;
      const lastTextMessageId = conversation.textMessages[conversation.textMessages.length - 1];
      const { body, read } = textMessages[lastTextMessageId];

      if (read) {
        return;
      }

      const { firstName, lastName } = patients[patientId];
      const messageHeading = `New message from ${firstName} ${lastName}`;

      DesktopNotification.showNotification(messageHeading, {
        body,
        onClick: () => {
          dispatch(push(`/chat/${chatId}`));

          if (isHub()) {
            import('./electron').then((electronThunk) => {
              dispatch(electronThunk.displayContent());
            });
          }
        },
      });
    }
  };
}

function filterUnreadMessages(textMessagesList) {
  return Object.values(textMessagesList).filter(message => !message.read);
}

function filterReadMessages(unreadList, textMessages) {
  textMessages = Object.values(textMessages);
  return unreadList.filter((unreadId) => {
    const newList = textMessages.filter(message => message.read && unreadId === message.id);
    return newList.length !== 0;
  });
}

export function createListOfUnreadedChats(result) {
  return (dispatch, getState) => {
    const { chat, auth, routing } = getState();
    const unreadMessages = chat.get('unreadChats');
    const selectedChatId = chat.get('selectedChatId');
    const currentUser = auth.getIn(['user', 'id']);
    const currentLocation = routing.location.pathname;

    if (result === {}) {
      return;
    }

    const readList = filterReadMessages(unreadMessages, result);
    const filteredUnreadList = without(unreadMessages, ...readList);

    result = filterUnreadMessages(result)
      .filter(
        message =>
          shouldUpdateUnreadChats(currentLocation, message, selectedChatId) &&
          currentUser !== message.userId
      )
      .map(message => message.id);

    result = uniq(result);
    const newUnreadChatsList = union(filteredUnreadList, result);
    return dispatch(setUnreadChats(newUnreadChatsList));
  };
}

function shouldUpdateUnreadChats(currentLocation, message, selectedChatId) {
  return !isOnChatPage(currentLocation) || selectedChatId !== message.chatId;
}

export function loadChatList(
  limit,
  skip = 0,
  url = '/api/chats',
  join = ['textMessages', 'patient']
) {
  return dispatch =>
    dispatch(
      fetchEntities({
        key: 'chats',
        join,
        params: {
          limit,
          skip,
        },
        url,
      })
    );
}

export function cleanChatList() {
  return dispatch => dispatch(deleteAllEntity('chats'));
}

export function loadUnreadChatList(limit, skip = 0) {
  return dispatch => dispatch(loadChatList(limit, skip, '/api/chats/unread', ['patient']));
}

export function loadFlaggedChatList(limit, skip = 0) {
  return dispatch => dispatch(loadChatList(limit, skip, '/api/chats/flagged'));
}

export function toggleFlagged(chatId, isFlagged) {
  return dispatch =>
    dispatch(
      updateEntityRequest({
        key: 'chats',
        values: { isFlagged: !isFlagged },
        url: `/api/chats/${chatId}`,
        merge: true,
      })
    );
}

export function markAsUnread(chatId, messageDate) {
  return (dispatch, getState) => {
    const { auth, entities } = getState();
    const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
    const accountTwilioNumber = activeAccount.get('twilioPhoneNumber');

    dispatch(
      updateEntityRequest({
        key: 'textMessages',
        values: {
          textMessageCreatedAt: messageDate,
          accountTwilioNumber,
        },
        url: `/api/chats/${chatId}/textMessages/unread`,
      })
    ).then((response) => {
      const { chat } = getState();
      const unreadChats = chat.get('unreadChats');

      const unreadMessagesList = filterUnreadMessages(response.textMessages)
        .filter(message => accountTwilioNumber !== message.from)
        .map(message => message.id);

      const newUnreadChatsList = union(unreadChats, unreadMessagesList);
      dispatch(setUnreadChats(newUnreadChatsList));
      dispatch(lockChat(chatId));
    });
  };
}

export function markAsRead(chatId) {
  return (dispatch, getState) => {
    const { chat } = getState();
    const lockedChats = chat.get('lockedChats') || [];

    if (lockedChats.includes(chatId)) {
      return;
    }

    dispatch(
      updateEntityRequest({
        key: 'textMessages',
        values: {},
        url: `/api/chats/${chatId}/textMessages/read`,
      })
    ).then((response) => {
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
    const filteredChatMessages = allMessages
      .filter(message => message.chatId === chatId)
      .sort(
        (messageOne, messageTwo) => new Date(messageOne.createdAt) - new Date(messageTwo.createdAt)
      );

    return dispatch(setChatMessages(filteredChatMessages || []));
  };
}

export function selectChat(id) {
  return (dispatch) => {
    dispatch(setSelectedChatId(id));
    dispatch(push(`/chat/${id || ''}`));

    if (id) {
      dispatch(markAsRead(id));
    }
    dispatch(unlockChat(id));
    dispatch(setChatMessagesListForChat(id));
  };
}

export function createNewChat(entityData) {
  return dispatch =>
    dispatch(
      createEntityRequest({
        key: 'chats',
        entityData,
        url: '/api/chats',
      })
    );
}

export function sendChatMessage(entityData) {
  return dispatch =>
    dispatch(
      createEntityRequest({
        key: 'chats',
        entityData,
        url: '/api/chats/textMessages',
      })
    );
}

export function socketLock(textMessages) {
  return (dispatch, getState) => {
    const { chat } = getState();
    const unreadChats = chat.get('unreadChats');
    const messages = Object.values(textMessages);

    const chatListToLock = messages.map(message => message.chatId);

    const unreadMessagesList = filterUnreadMessages(textMessages).map(message => message.id);
    const newUnreadChatsList = union(unreadChats, unreadMessagesList);

    dispatch(setUnreadChats(newUnreadChatsList));
    dispatch(lockChatList(chatListToLock));
    dispatch(receiveEntities({ key: 'textMessages', entities: { textMessages } }));
  };
}

export function lockChatList(chatListToLock) {
  return (dispatch, getState) => {
    const { chat } = getState();

    const lockedChats = chat.get('lockedChats');
    const chatsToLock = uniq([...chatListToLock, ...lockedChats]);

    return dispatch(setLockedChats(chatsToLock));
  };
}

export function lockChat(chatId) {
  return (dispatch, getState) => {
    const { chat } = getState();
    const lockedChats = chat.get('lockedChats');

    if (!lockedChats.includes(chatId)) {
      lockedChats.push(chatId);
    }

    dispatch(setLockedChats(lockedChats));
  };
}

export function unlockChat(chatId) {
  return (dispatch, getState) => {
    if (!chatId) {
      return;
    }
    const { chat } = getState();
    const lockedChats = chat.get('lockedChats');

    pull(lockedChats, chatId);
    dispatch(setLockedChats(lockedChats));
    dispatch(markAsRead(chatId));
  };
}
