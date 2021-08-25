import createCollection from '../createCollection';
import Superadmin from '../models/Superadmin';

export default class superadmins extends createCollection(Superadmin) {
  getUrlRoot() {
    return '/api/users/superadmins';
  }
}
