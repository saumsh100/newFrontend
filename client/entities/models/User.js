
import createModel from '../createModel';

const UserSchema = {
  id: null,
  username: null,
  activeAccountid: null,
};

export default class User extends createModel(UserSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
  getUsername(){
    return this.get('username');
  }
}