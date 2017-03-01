import createModel from '../createModel';

const AccountSchema = {
  id: null,
  name: null,
  street: null,
  country: null,
  state: null,
  city: null,
  zipCode: null,
  vendastaId: null,
  smsPhoneNumber: null,
}

export default class Account extends createModel(AccountSchema) {

}