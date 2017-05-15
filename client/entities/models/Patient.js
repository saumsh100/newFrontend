
import createModel from '../createModel';

const PatientSchema = {
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

export default class Patient extends createModel(PatientSchema) {
  /**
   * Add all Patient specific member functions here
   */
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getInsurance(){
    return this.get('insurance');
  }

  getUrlRoot() {
    return '/api/patients/';
  }
}
