
import { dateFormatter } from '@carecru/isomorphic';
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
  insuranceCarrier: null,
  insuranceMemberId: null,
  insuranceGroupId: null,
};

export default class PatientUser extends createModel(PatientUserSchema) {
  /**
   * Add all Patient specific member functions here
   */
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getBirthDate() {
    const birthDate = this.get('birthDate');
    return birthDate ? dateFormatter(birthDate, '', 'MM/DD/YYYY') : '';
  }
}
