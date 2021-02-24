
import createCollection from '../createCollection';
import Appointments from '../models/Appointments';

export default class appointments extends createCollection(Appointments) {
  getUrlRoot() {
    return '/api/appointments';
  }
}
