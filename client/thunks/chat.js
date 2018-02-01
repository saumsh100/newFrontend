
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
    const sortedChats = chats.sort((a, b) => a.lastTextMessageDate < b.lastTextMessageDate);
    const firstChat = sortedChats.first();
    dispatch(setSelectedChatId(firstChat.get('id')));
  };
}
