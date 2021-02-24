
import createCollection from '../createCollection';
import Permission from '../models/Permission';

export default class permissions extends createCollection(Permission) {
  getUrlRoot() {
    return '/api/permissions';
  }
}
