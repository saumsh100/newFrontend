
import moment from 'moment';
import createModel from '../createModel';

const PatientSchema = {
  lastAppointmentDate: null,
  nextAppointmentTitle: null,
  firstName: null,
  avatarUrl: null,
  middleName: null,
  lastName: null,
  startDate: null,
  phoneNumber: null,
  mobileNumber: null,
  workNumber: null,
  gender: null,
  address: null,
  preferences: null,
  accountId: null,
  photo: null,
  email: null,
  patientId: null,
  language: null,
  birthDate: null,
  status: null,
  id: null,
  insurance: {},
  isDeleted: null,
  isSyncedWithPMS: null,
  appointments: null,
};

export default class Patient extends createModel(PatientSchema) {
  /**
   * Add all Patient specific member functions here
   */
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getAge() {
    return moment().diff(this.get('birthDate'), 'years');
  }

  getInsurance(){
    return this.get('insurance');
  }

  getUrlRoot() {
    return '/api/patients/';
  }
}
