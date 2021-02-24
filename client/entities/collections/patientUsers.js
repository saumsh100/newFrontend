
import createCollection from '../createCollection';
import PatientUser from '../models/PatientUser';

export default class patientUsers extends createCollection(PatientUser) {
  /**
   * Add all Patient specific member functions here
   */
  /*
  getUrlRoot() {
    return '/api/patients';
  }
  */
}
