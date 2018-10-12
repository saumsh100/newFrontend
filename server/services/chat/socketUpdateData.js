
import { Chat, TextMessage, User, Patient } from 'CareCruModels';
import { NEW_MESSAGE, UPDATE_CHAT, MARK_UNREAD, MARK_READ } from './consts';

/**
 * Get a with last message received, suitable for NEW_MESSAGE event.
 * @param id The ID of chat.
 * @returns {Promise}
 */
function getChatWithLatestMessage(id) {
  return Chat.findOne({
    where: { id },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: false,
        order: [['createdAt', 'DESC']],
        limit: 1,
        separate: true,
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: 'password' },
          required: false,
        },
      },
      {
        model: Patient,
        as: 'patient',
        required: false,
      },
    ],
    order: [
      [['lastTextMessageDate', 'DESC']],
    ],
  });
}

/**
 * Get the updated chat, suitable for UPDATE_CHAT.
 * @param id
 * @return {Promise<Chat>}
 */
function getUpdatedChat(id) {
  return Chat.findOne({
    where: { id },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: false,
        order: [['createdAt', 'DESC']],
        limit: 5,
        separate: true,
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: 'password' },
          required: false,
        },
      },
      {
        model: Patient,
        as: 'patient',
        required: false,
      },
    ],
  });
}

/**
 * Get a chat with unread messages, suitable for UNREAD_MESSAGE event.
 * @param id The ID of chat.
 * @returns {Promise}
 */
function getChatWithUnreadMessages(id) {
  return Chat.findOne({
    where: { id },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: true,
        where: { read: false },
        order: [['createdAt', 'DESC']],
        limit: 20,
        separate: true,
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: 'password' },
          required: false,
        },
      },
      {
        model: Patient,
        as: 'patient',
        required: false,
      },
    ],
    order: [
      [['lastTextMessageDate', 'DESC']],
    ],
  });
}

/**
 * Get a chat with read messages, suitable for MARK_READ event.
 * @param id The ID of chat.
 * @returns {Promise}
 */
function getChatWithReadMessages(id) {
  return Chat.findOne({
    where: { id },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: true,
        where: { read: true },
        order: [['createdAt', 'DESC']],
        limit: 15,
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: 'password' },
          required: false,
        },
      },
      {
        model: Patient,
        as: 'patient',
        required: false,
      },
    ],
    order: [
      [['lastTextMessageDate', 'DESC']],
    ],
  });
}

/**
 * Maps a socket event with a proper handler.
 */
const SocketHandlersMap = {
  [NEW_MESSAGE]: getChatWithLatestMessage,
  [UPDATE_CHAT]: getUpdatedChat,
  [MARK_UNREAD]: getChatWithUnreadMessages,
  [MARK_READ]: getChatWithReadMessages,
};

/**
 * Returns relevant data for socket update based on update event we are triggering.
 * @param chatId
 * @param event
 * @return {Promise<*>}
 */
export default async function getRelevantSocketUpdateData(chatId, event) {
  return SocketHandlersMap[event](chatId);
}
