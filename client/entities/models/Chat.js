
import createModel from '../createModel';

const ChatSchema = {
  id: null,
  accountId: null,
  patientId: null,
  patientPhoneNumber: null,
  textMessages: null,
  lastTextMessageDate: null,
  lastTextMessageId: null,
  isFlagged: null,
  hasUnread: null,
  createdAt: null,
  updatedAt: null,
  isOpen: false,
};

export default class Chat extends createModel(ChatSchema, 'Chat') {
  /**
   * Add all Chat specific member functions here
   */
  getUrlRoot() {
    return '/api/chats';
  }
}
