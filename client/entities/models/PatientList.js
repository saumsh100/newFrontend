import createModel from '../createModel';

const PatientListSchema = {
	lastAppointmentDate: null,
	nextAppointmentTitle: null,
	name: null,
	age: null,
};

export default class PatientList extends createModel(PatientListSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
   getUrlRoot() {
     return `/api/patients/`;
   }
}
