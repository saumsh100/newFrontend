
import { push } from 'react-router-redux';
import pull from 'lodash/pull';
import pullAll from 'lodash/pullAll';
import uniq from 'lodash/uniq';
import union from 'lodash/union';
import without from 'lodash/without';
import {
  setSelectedChat,
  setUnreadChats,
  setChatMessages,
  setLockedChats,
  setChatPoC,
  setNewChat,
  updateChatId,
  setTotalChatMessages,
  setPatientChat,
  unsetPatientChat,
} from '../reducers/chat';
import { fetchEntitiesRequest, updateEntityRequest, createEntityRequest } from './fetchEntities';
import DesktopNotification from '../util/desktopNotification';
import PatientModel from '../entities/models/Patient';
import { deleteAllEntity, deleteEntity, receiveEntities } from '../reducers/entities';
import { isHub } from '../util/hub';
import { sortByFieldAsc, sortTextMessages } from '../components/library/util/SortEntities';
import { httpClient } from '../util/httpClient';

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
    const sortedChats = sortByFieldAsc(chats, 'lastTextMessageDate');

    const firstChat = sortedChats.first();
    if (firstChat) {
      dispatch(selectChat(firstChat.get('id')));
    }
  };
}

export function loadUnreadMessages() {
  return dispatch =>
    httpClient()
      .get('/api/chats/unread/count')
      .then(result => dispatch(setUnreadChats(result.data || [])));
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
      const { patientId } = conversation;
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
  return textMessagesList ? Object.values(textMessagesList).filter(message => !message.read) : [];
}

function filterReadMessages(unreadList, textMessages) {
  if (!textMessages) {
    return [];
  }

  const textMessagesArray = Object.values(textMessages);
  return unreadList.filter((unreadId) => {
    const newList = textMessagesArray.filter(message => message.read && unreadId === message.id);
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
          currentUser !== message.userId,
      )
      .map(message => message.id);

    result = uniq(result);
    const newUnreadChatsList = union(filteredUnreadList, result);
    dispatch(setUnreadChats(newUnreadChatsList));
  };
}

function shouldUpdateUnreadChats(currentLocation, message, selectedChatId) {
  return !isOnChatPage(currentLocation) || selectedChatId !== message.chatId;
}

export function loadChatList(
  limit,
  skip = 0,
  url = '/api/chats',
  join = ['textMessages', 'patient'],
) {
  return dispatch =>
    dispatch(
      fetchEntitiesRequest({
        key: 'chats',
        id: 'fetchingChats',
        join,
        params: {
          limit,
          skip,
        },
        url,
      }),
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
      }),
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
      }),
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
        key: 'chats',
        values: {},
        url: `/api/chats/${chatId}/textMessages/read`,
      }),
    ).then(({ textMessages = {} }) => {
      const unreadChats = chat.get('unreadChats');
      const listToRemove = Object.keys(textMessages);

      pullAll(unreadChats, listToRemove);
      dispatch(setUnreadChats(unreadChats));
    });
  };
}

export function loadChatMessages(chatId, offset = 0, limit = 15) {
  return (dispatch) => {
    if (!chatId) {
      return dispatch(setChatMessagesListForChat(chatId));
    }
    const url = `/api/chats/${chatId}/textMessages?skip=${offset}&limit=${limit}`;
    return httpClient()
      .get(url)
      .then(({ data }) => {
        dispatch(
          receiveEntities({
            key: 'textMessages',
            entities: data.entities,
          }),
        );
        return data.total;
      })
      .then(total => dispatch(setChatMessagesListForChat(chatId, total)));
  };
}

export function setChatMessagesListForChat(chatId, total = 0) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const allMessages = entities.getIn(['textMessages', 'models']);
    const filteredChatMessages = allMessages
      .filter(message => message.chatId === chatId)
      .sort(sortTextMessages);

    dispatch(setTotalChatMessages(total));
    return dispatch(setChatMessages(filteredChatMessages || []));
  };
}

export async function setChatIsPoC(patient, dispatch) {
  if (!patient || !(patient instanceof PatientModel && patient.get('cellPhoneNumber'))) {
    return dispatch(setChatPoC(patient));
  }

  let pocPatient = patient;
  try {
    const { data: poc } = await patient.isCellPhoneNumberPoC();
    const { patients } = await dispatch(
      fetchEntitiesRequest({
        url: '/api/patients/search',
        params: { patientId: poc.id },
      }),
    );

    if (patients[poc.id]) {
      pocPatient = patients[poc.id];
    }
  } catch (e) {
    console.error(e);
  }

  return dispatch(setChatPoC(pocPatient));
}

export function selectChat(id, createChat = null) {
  return async (dispatch, getState) => {
    const { routing, entities, chat } = getState();
    const currentChatId = chat.get('selectedChatId');
    if (id && currentChatId === id) return;
    const chatEntity =
      !createChat &&
      id &&
      entities.getIn(['chats', 'models', id]) &&
      entities.getIn(['chats', 'models', id]).delete('textMessages');

    dispatch(setNewChat(createChat));
    dispatch(setSelectedChat(chatEntity));

    const patientId =
      (!!createChat && createChat.patientId) || (id && chatEntity && chatEntity.get('patientId'));
    if (!!patientId === true) {
      const futurePatient = entities.getIn(['patients', 'models', patientId]);
      await setChatIsPoC(futurePatient, dispatch);
    } else {
      await setChatIsPoC(patientId, dispatch);
    }
    dispatch(updateChatId());
    if (isOnChatPage(routing.location.pathname) && !isHub()) {
      dispatch(push(`/chat/${id || ''}`));
    }

    dispatch(unlockChat(id));
    dispatch(loadChatMessages(id));
  };
}

export function createNewChat(entityData) {
  return dispatch =>
    dispatch(
      createEntityRequest({
        key: 'chats',
        entityData,
        url: '/api/chats',
        alert: {
          error: { body: 'Failed to create a conversation with this patient.' },
        },
      }),
    );
}

export function sendChatMessage(entityData) {
  return dispatch =>
    dispatch(
      createEntityRequest({
        key: 'chats',
        entityData,
        url: '/api/chats/textMessages',
        alert: { error: { body: 'Failed to send patient the text message.' } },
      }),
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
    dispatch(
      receiveEntities({
        key: 'textMessages',
        entities: { textMessages },
      }),
    );
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

export function resendMessage(messageId, patientId, chatId) {
  return dispatch =>
    dispatch(
      updateEntityRequest({
        key: 'chats',
        values: { patientId },
        url: `/api/chats/textMessage/${messageId}/resend`,
      }),
    ).then(() => {
      dispatch(
        deleteEntity({
          key: 'textMessages',
          id: messageId,
        }),
      );
      dispatch(setChatMessagesListForChat(chatId));
    });
}

export function getOrCreateChatForPatient(patientId) {
  return (dispatch) => {
    dispatch(unsetPatientChat());

    return httpClient()
      .get(`/api/patients/${patientId}/chat`)
      .then(({ data: { chatId } }) => dispatch(setPatientChat(chatId)));
  };
}
