
import createCollection from '../createCollection';
import Requests from '../models/Request';

export default class requests extends createCollection(Requests) {
  getUrlRoot() {
    return '/api/requests';
  }
}
