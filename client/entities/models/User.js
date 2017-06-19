
import createModel from '../createModel';

const UserSchema = {
  avatarUrl: null,
  id: null,
  firstName: null,
  lastName: null,
  username: null,
  activeAccountid: null,
  permissionId: null,
};

export default class User extends createModel(UserSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
  getUsername() {
    return this.get('username');
  }
  getName() {
    return `${this.get('firstName')} ${this.get('lastName')}` ;
  }

}
