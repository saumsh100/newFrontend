import createModel from '../createModel';

const PatientListSchema = {
	lastAppointmentDate: null,
	nextAppointmentTitle: null,
  firstName: null,
  lastName: null,
  startDate: null,
  phoneNumber: null,
	gender: null,
	photo: null,
  email: null,
	patientId: null,
	language: null,
	birthDate: null,
	status: null,
	id: null,
	insurance: null,
	middleName: null,
};

export default class PatientList extends createModel(PatientListSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
   getUrlRoot() {
     return `/api/patients/`;
   }
}
