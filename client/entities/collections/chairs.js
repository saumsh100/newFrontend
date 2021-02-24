
import createCollection from '../createCollection';
import Chair from '../models/Chair';

export default class chairs extends createCollection(Chair) {
  getUrlRoot() {
    return '/api/chairs';
  }
}
