import createModel from '../createModel';

const AccountSchema = {
  id: null,
  name: null,
  vendastaId: null,
  smsPhoneNumber: null,
}

export default class Account extends createModel(AccountSchema) {

}