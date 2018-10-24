
import createModel from '../createModel';

const ChatSchema = {
  id: null,
  accountId: null,
  patientId: null,
  textMessages: null,
  lastTextMessageDate: null,
  lastTextMessageId: null,
  isFlagged: null,
  hasUnread: null,
};

export default class Chat extends createModel(ChatSchema) {
  /**
   * Add all Chat specific member functions here
   */
  getUrlRoot() {
    return '/api/chats';
  }
}
