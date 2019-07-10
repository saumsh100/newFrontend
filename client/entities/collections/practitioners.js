
import createCollection from '../createCollection';
import Practitioners from '../models/Practitioners';

export default class practitioners extends createCollection(Practitioners) {
  getUrlRoot() {
    return '/api/practitioners';
  }
}
