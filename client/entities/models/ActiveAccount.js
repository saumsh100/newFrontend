import Account from './Account';

export default class ActiveAccount extends Account {

  getUrlRoot() {
    const { auth } = window.store.getState();
    return `/api/accounts/${auth.get('accountId')}`;
  }

}
