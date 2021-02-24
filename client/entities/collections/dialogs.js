
import createCollection from '../createCollection';
import Dialog from '../models/Dialogs';

export default class dialog extends createCollection(Dialog) {
  /**
   * Add all TextMessage specific member functions here
   */

  getUrlRoot() {
    return '/api/textMessages/dialogs';
  }
}
