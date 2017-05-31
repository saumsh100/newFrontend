import createCollection from '../createCollection';
import Account from '../models/Account';

export default class accounts extends createCollection(Account) {

  getUrlRoot() {
    const { auth } = window.store.getState();
    return `/api/accounts/${auth.get('accountId')}`;
  }

}
