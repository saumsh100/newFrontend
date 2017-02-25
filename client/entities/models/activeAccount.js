import createModel from '../createModel';

const activeAccountSchema = {
  id: null,
  name: null,
  vendastaId: null,
  smsPhoneNumber: null,
}

export default class activeAccount extends createModel(activeAccountSchema) {
  getUrlRoot() {
    return `/api/accounts/${this.get('id')}`;
  }
}