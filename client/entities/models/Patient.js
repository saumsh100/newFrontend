
import createModel from '../createModel';
import { httpClient } from '../../util/httpClient';
import { getUTCDate, getTodaysDate } from '../../components/library/util/datetime';

const PatientSchema = {
  firstName: null,
  avatarUrl: null,
  middleName: null,
  lastName: null,
  startDate: null,
  // phoneNumber: null,
  homePhoneNumber: null,
  cellPhoneNumber: null,
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
  lastHygieneApptId: null,
  lastHygieneDate: null,
  lastRecallApptId: null,
  lastRecallDate: null,
  nextApptId: null,
  nextApptDate: null,
  lastRestorativeDate: null,
  lastRestorativeApptId: null,
  insuranceInterval: null,
  firstApptId: null,
  firstApptDate: null,
  dueForHygieneDate: null,
  dueForRecallExamDate: null,
  omitReminderIds: null,
  omitRecallIds: null,
  isUnknown: false,
  // virtual field, used to determinate if there is a pre-created chat for that phone number.
  isProspect: false,
  request: null,
  foundChatId: null,
};

export default class Patient extends createModel(PatientSchema) {
  /**
   * Add all Patient specific member functions here
   */
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getAge() {
    const birthDate = this.get('birthDate');
    return birthDate && getUTCDate(birthDate).isValid()
      ? getTodaysDate().diff(this.get('birthDate'), 'years')
      : '';
  }

  getInsurance() {
    return this.get('insurance');
  }

  isCellPhoneNumberPoC() {
    return this.isPoc('mobile', this.get('cellPhoneNumber'));
  }

  isEmailPoC() {
    return this.isPoc('email', this.get('email'));
  }

  isPoc(key, value) {
    return httpClient().get('/api/patients/poc', { params: { [key]: value } });
  }

  getUrlRoot() {
    return '/api/patients/';
  }
}
