
import { getFormattedDate } from '../../components/library/util/datetime';
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

export default class PatientUser extends createModel(PatientUserSchema, 'PatientUser') {
  /**
   * Add all Patient specific member functions here
   */
  getFullName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }

  getBirthDate() {
    const birthDate = this.get('birthDate');
    return birthDate ? getFormattedDate(birthDate, 'MM/DD/YYYY') : '';
  }
}
