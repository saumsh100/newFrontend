
import moment from 'moment';
import createModel from '../createModel';

const PatientSchema = {
  firstName: null,
  avatarUrl: null,
  middleName: null,
  lastName: null,
  startDate: null,
  //phoneNumber: null,
  homePhoneNumber: null,
  mobilePhoneNumber: null,
  workPhoneNumber: null,
  otherPhoneNumber: null,
  preferredPhoneNumber: null,
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
  isSyncedWithPms: null,
  appointments: null,
  patientUserId: null,
  lastApptId: null,
  lastApptDate: null,
  nextApptId: null,
  nextApptDate: null,
  firstApptId: null,
  firstApptDate: null,
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
