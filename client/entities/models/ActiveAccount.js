import jwt from 'jwt-decode';
import Account from './Account';


export default class ActiveAccount extends Account {

  getUrlRoot() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    return `/api/accounts/${decodedToken.activeAccountId}`;
  }

}
