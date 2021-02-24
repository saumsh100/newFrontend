
import createModel from '../createModel';

const TextMessageSchema = {
  id: null,
  chatId: null,
  to: null,
  from: null,
  smsStatus: null,
  status: null,
  createdAt: null,
  body: null,
  read: null,
  user: null,
  userId: null,
};

export default class TextMessage extends createModel(TextMessageSchema, 'TextMessage') {
  /**
   * Add all TextMessage specific member functions here
   */
  getUrlRoot() {
    return '/api/textMessages';
  }
}
