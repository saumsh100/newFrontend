
import { setSelectedChatId } from '../reducers/chat';

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
    if (chat.get('selectedChatId')) return;

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
    dispatch(setSelectedChatId(firstChat.get('id')));
  };
}
