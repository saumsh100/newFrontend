
import createCollection from '../createCollection';
import WaitSpot from '../models/WaitSpot';

export default class waitSpots extends createCollection(WaitSpot) {
  getUrlRoot() {
    return '/api/waitSpots';
  }
}
