
import createModel from '../createModel';

const PatientSchema = {
  lastAppointmentDate: null,
  nextAppointmentTitle: null,
  firstName: null,
  middleName: null,
  lastName: null,
  startDate: null,
  phoneNumber: null,
  mobileNumber: null,
  workNumber: null,
  gender: null,
  address: null,
  preferences: null,
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
