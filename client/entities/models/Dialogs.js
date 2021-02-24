
import createModel from '../createModel';

const DialogSchema = {
  unreadCount: null,
  lastMessageText: null,
  lastMessageTime: null,
  messages: null,
  patientId: null,
  patientName: null,
};

export default class Dialog extends createModel(DialogSchema, 'Dialog') {
  /**
   * Add all TextMessage specific member functions here
   */
  getUrlRoot() {
    return '/api/textMessages/dialogs';
  }
}
