

import createCollection from '../createCollection';
import PatientList from '../models/PatientList';

export default class patientList extends createCollection(PatientList) {
  /**
   * Add all TextMessage specific member functions here
   */

  getUrlRoot() {
    return '/api/patients/';
  }
}
