import createModel from '../createModel';

const PatientUserSchema = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  mobilePhoneNumber: null,
};

export default class PatientUser extends createModel(PatientUserSchema) {

}
