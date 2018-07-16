
import { Chat } from '../../_models';
import logger from '../../config/logger';

export async function createChat(chatToInsert) {
  try {
    const chat = await Chat.create(chatToInsert, { raw: true });
    return chat.get({ plain: true });
  } catch (exception) {
    logger.error(exception);
    throw Error(exception);
  }
}

export async function updateLastMessageData(chatId, messageId, date) {
  try {
    return await Chat.update({
      lastTextMessageId: messageId,
      lastTextMessageDate: date || new Date(),
    }, {
      where: {
        id: chatId,
      },
    });
  } catch (exception) {
    logger.error(exception);
    throw Error(exception);
  }
}
