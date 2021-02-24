
import createModel from '../createModel';

const PatientListSchema = {
  lastAppointmentDate: null,
  nextAppointmentTitle: null,
  firstName: null,
  middleName: null,
  lastName: null,
  startDate: null,
  homePhoneNumber: null,
  mobilePhoneNumber: null,
  workPhoneNumber: null,
  otherPhoneNumber: null,
  preferredPhoneNumber: null,
  gender: null,
  photo: null,
  email: null,
  patientId: null,
  language: null,
  birthDate: null,
  status: null,
  id: null,
  insurance: null,
  appointments: null,
};

export default class PatientList extends createModel(PatientListSchema, 'PatientList') {
  // TODO: temp fix, this file will be removed
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  /**
   * Add all TextMessage specific member functions here
   */
  getUrlRoot() {
    return '/api/patients/';
  }
}
