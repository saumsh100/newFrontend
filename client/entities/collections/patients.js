

import createCollection from '../createCollection';
import Patient from '../models/Patient';

export default class patients extends createCollection(Patient) {
  /**
   * Add all Patient specific member functions here
   */
  getUrlRoot() {
    return '/api/patients';
  }
}
