
import createCollection from '../createCollection';
import Account from '../models/Account';

export default class accounts extends createCollection(Account) {
  getUrlRoot(base) {
    const { auth } = window.store.getState();
    const baseUrl = '/api/accounts';
    return base ? baseUrl : `${baseUrl}/${auth.get('accountId')}`;
  }
}
