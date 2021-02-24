
import createCollection from '../createCollection';
import Call from '../models/Call';

export default class calls extends createCollection(Call) {
  getUrlRoot() {
    return '/api/calls';
  }
}
