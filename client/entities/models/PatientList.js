import createModel from '../createModel';

const PatientListSchema = {
	lastAppointmentDate: null,
	nextAppointmentTitle: null,
	name: null,
  	gender: null,
	photo: null,
	patientId: null,
	language: null,
	birthday: null,
	id: null,
};

export default class PatientList extends createModel(PatientListSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
   getUrlRoot() {
     return `/api/patients/`;
   }
}
