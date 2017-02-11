
import createModel from '../createModel';

const TextMessageSchema = {
  id: null,
  to: null,
  from: null,
  message: null,
  status: null,
  createdAt: null,
  body: null,
  patientId: null,
  read: null,
  senderId: null,
};

export default class TextMessage extends createModel(TextMessageSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
   getUrlRoot() {
     return `/api/textMessages`;
   }
}
