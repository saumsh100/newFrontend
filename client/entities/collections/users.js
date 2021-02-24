
import createCollection from '../createCollection';
import User from '../models/User';

export default class users extends createCollection(User) {
  getUrlRoot() {
    return '/api/users';
  }
}
