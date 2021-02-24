
import createCollection from '../createCollection';
import Segment from '../models/Segment';

export default class segments extends createCollection(Segment) {
  getUrlRoot() {
    return '/api/segments';
  }
}
