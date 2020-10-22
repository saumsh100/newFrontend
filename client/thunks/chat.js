
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import pull from 'lodash/pull';
import pullAll from 'lodash/pullAll';
import uniq from 'lodash/uniq';
import union from 'lodash/union';
import without from 'lodash/without';
import {
  setChatIsLoading,
  setChatMessages,
  setChatCategoriesCount,
  setChatPoC,
  setConversationIsLoading,
  setLockedChats,
  setNewChat,
  setPatientChat,
  setSelectedChat,
  setTotalChatMessages,
  setUnreadChats,
  setUnreadChatsCount,
  unsetPatientChat,
  updateChatId,
} from '../reducers/chat';
import { createEntityRequest, fetchEntitiesRequest, updateEntityRequest } from './fetchEntities';
import DesktopNotification from '../util/desktopNotification';
import PatientModel from '../entities/models/Patient';
import { deleteAllEntity, deleteEntity, receiveEntities } from '../reducers/entities';
import { isHub } from '../util/hub';
import { sortByFieldAsc, sortTextMessages } from '../components/library/util/SortEntities';
import { httpClient } from '../util/httpClient';
import determineProspectForChat from './prospects';

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
      .get('/api/chats/unread/list')
      .then(result => dispatch(setUnreadChats(result.data || [])));
}

export function loadUnreadChatCount() {
  return dispatch =>
    httpClient()
      .get('/api/chats/unread/count')
      .then(result => dispatch(setUnreadChatsCount(result.data.unreadChatsCount || 0)));
}

export function addMessage(message) {
  return (dispatch, getState) => {
    const { chat, electron, router } = getState();
    const selectedChatId = chat.get('selectedChatId');
    const chatPageActive =
      isOnChatPage(router.location.pathname) && (!isHub() || electron.get('showContent'));
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
    const { chat, auth, router } = getState();
    const unreadMessages = chat.get('unreadChats');
    const selectedChatId = chat.get('selectedChatId');
    const currentUser = auth.getIn(['user', 'id']);
    const currentLocation = router.location.pathname;

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

export function loadOpenChatList(limit, skip = 0) {
  return dispatch => dispatch(loadChatList(limit, skip, '/api/chats/open?isOpen=true'));
}

export function loadClosedChatList(limit, skip = 0) {
  return dispatch => dispatch(loadChatList(limit, skip, '/api/chats/closed?isOpen=false'));
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

export const toggleVisibility = (chatId, isOpen) => async (dispatch) => {
  const values =
    isOpen === true
      ? { isOpen }
      : {
        isOpen,
        hasUnread: false,
      };
  return dispatch(
    updateEntityRequest({
      key: 'chats',
      values,
      url: `/api/chats/${chatId}`,
      merge: true,
      alert: {
        success: { body: `Successfully ${isOpen ? 'reopened' : 'closed'} conversation` },
        error: { body: `Failed ${isOpen ? 'closing' : 'reopening'} conversation` },
      },
    }),
  ).then(() => {
    dispatch(unlockChat(chatId));
  });
};

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
    )
      .then((response) => {
        const { chat } = getState();
        const unreadChats = chat.get('unreadChats');

        const unreadMessagesList = filterUnreadMessages(response.textMessages)
          .filter(message => accountTwilioNumber !== message.from)
          .map(message => message.id);

        const newUnreadChatsList = union(unreadChats, unreadMessagesList);
        dispatch(setUnreadChats(newUnreadChatsList));
        dispatch(lockChat(chatId));
      })
      .then(() => {
        dispatch(loadUnreadChatCount());
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
    )
      .then(({ textMessages = {} }) => {
        const unreadChats = chat.get('unreadChats');
        const listToRemove = Object.keys(textMessages);
        const newList = pullAll(unreadChats, listToRemove);

        dispatch(setUnreadChats(newList));
      })
      .then(() => {
        dispatch(loadUnreadChatCount());
      });
  };
}

export function loadChatMessages(chatId, offset = 0, limit = 15) {
  return (dispatch, getState) => {
    const { chat } = getState();

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
      .then(total => dispatch(setChatMessagesListForChat(chatId, total)))
      .finally(() => {
        if (chat.get('isLoading')) {
          dispatch(setChatIsLoading(false));
        }
      });
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
    pocPatient = poc;
  } catch (e) {
    console.error(e);
  }

  return dispatch(setChatPoC(pocPatient));
}

export function getChatEntity(id) {
  return async (dispatch, getState) => {
    // New chat
    if (id === null) {
      return null;
    }
    const { chat, entities } = getState();
    const storedEntity = entities.getIn(['chats', 'models', id]);

    return (
      storedEntity ||
      httpClient()
        .get(`/api/chats/${id}`)
        .then(({ data }) =>
          dispatch(
            fetchEntitiesRequest({
              url: '/api/patients/search',
              params: { patientId: data.entities.chats[id].patientId },
            }),
          ))
        .then(({ chats }) => Map(chats[id]))
        .finally(() => {
          if (chat.get('isLoading')) {
            dispatch(setChatIsLoading(false));
          }
        })
    );
  };
}

export function selectChat(id, createChat = null) {
  return async (dispatch, getState) => {
    const { router, entities, chat } = getState();
    const currentChatId = chat.get('selectedChatId');

    if (id && currentChatId === id) {
      return;
    }

    const chatEntity = await dispatch(getChatEntity(id)).then(data =>
      (data === null ? data : data.delete('textMessages')));

    dispatch(setConversationIsLoading(true));
    dispatch(setNewChat(createChat));
    dispatch(setSelectedChat(chatEntity));

    chatEntity && dispatch(determineProspectForChat(chatEntity.toJS()));

    const patientId =
      (!!createChat && createChat.patientId) || (id && chatEntity && chatEntity.get('patientId'));
    if (!!patientId === true) {
      const futurePatient = entities.getIn(['patients', 'models', patientId]);
      await setChatIsPoC(futurePatient, dispatch);
    } else {
      await setChatIsPoC(patientId, dispatch);
    }
    dispatch(updateChatId());
    if (isOnChatPage(router.location.pathname) && !isHub()) {
      dispatch(push(`/chat/${id || ''}`));
    }

    dispatch(unlockChat(id));
    dispatch(loadChatMessages(id));
    dispatch(setConversationIsLoading(false));

    return chatEntity;
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

export function getChatCategoryCounts() {
  return dispatch =>
    httpClient()
      .get('/api/chats/count/categories')
      .then(({ data }) => dispatch(setChatCategoriesCount(data)));
}

export function selectChatByPatientId(patientId) {
  return dispatch =>
    httpClient()
      .get(`/api/patients/${patientId}/chat`)
      .then(({ data: { chatId } }) => {
        dispatch(selectChat(chatId));
      });
}
