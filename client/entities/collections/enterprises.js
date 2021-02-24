
import createCollection from '../createCollection';
import Enterprise from '../models/Enterprise';

export default class enterprises extends createCollection(Enterprise) {
  /**
   * Add all Patient specific member functions here
   */
  getUrlRoot() {
    return '/api/enterprises';
  }
}
