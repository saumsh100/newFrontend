
import createCollection from '../createCollection';
import Service from '../models/Service';

export default class services extends createCollection(Service) {
  getUrlRoot() {
    return '/api/services';
  }
}
