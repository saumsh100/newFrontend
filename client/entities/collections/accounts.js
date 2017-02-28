import createCollection from '../createCollection';
import Account from '../models/Account';
import jwt from 'jwt-decode';

export default class accounts extends createCollection(Account) {

  getUrlRoot() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    return `/api/accounts/${decodedToken.activeAccountId}`;
  }

}