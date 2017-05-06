
import createModel from '../createModel';

const PatientSchema = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  status: null,
  image: null,
  gender: null,
  language: null,
  insurance: null,
  birthDate: null,
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
    return `/api/patients/${this.getId()}`;
  }
}
