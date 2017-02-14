
import createCollection from '../createCollection';
import Availability from '../models/Availability';

export default class availabilities extends createCollection(Availability) {

  getUrlRoot() {
    return '/api/availabilities';
  }
}
