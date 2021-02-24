
import createCollection from '../createCollection';
import Chat from '../models/TextMessage';

export default class chat extends createCollection(Chat) {
  /**
   * Add all CHat specific member functions here
   */

  getUrlRoot() {
    return '/api/chats';
  }
}
