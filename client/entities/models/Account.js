
import { Record } from 'immutable';
import createModel from '../createModel';

// Helps parse off unnecessary API data
//TODO: need a fromJS function to do this, nested Records are ignored
/*const OfficeHoursRecord = Record({
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
});*/

const AccountSchema = {
  id: null,
  name: null,
  street: null,
  logo: null,
  country: null,
  state: null,
  city: null,
  zipCode: null,
  vendastaId: null,
  twilioPhoneNumber: null,
  enterpriseId: null,
  weeklyScheduleId: null, //new OfficeHoursRecord(),
};

export default class Account extends createModel(AccountSchema) {

  getUrlRoot() {
    return `/api/accounts/${this.getId()}`;
  }

}
