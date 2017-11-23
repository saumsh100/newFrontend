
import createCollection from '../createCollection';
import Event from '../models/Event';

export default class events extends createCollection(Event) {

  getUrlRoot() {
    return '/api/events';
  }
}
