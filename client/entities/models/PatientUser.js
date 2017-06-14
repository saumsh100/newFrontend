import createModel from '../createModel';

const PatientUserSchema = {
  email: null,
  firstName: null,
  lastName: null,
  mobilePhoneNumber: null,
};

export default class PatientUser extends createModel(PatientUserSchema) {

}
