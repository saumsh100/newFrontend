
import createCollection from '../createCollection';
import TextMessage from '../models/TextMessage';

export default class textMessages extends createCollection(TextMessage) {
  /**
   * Add all TextMessage specific member functions here
   */

  getUrlRoot() {
    return '/api/textMessages';
  }
}
