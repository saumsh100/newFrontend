
import createModel from '../createModel';

const PatientUserSchema = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  isPhoneNumberConfirmed: null,
  patientUserFamilyId: null,
  avatarUrl: null,
  birthDate: null,
  gender: null,
};

export default class PatientUser extends createModel(PatientUserSchema) {
  /**
   * Add all Patient specific member functions here
   */
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }
}
