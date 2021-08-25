import createModel from '../createModel';

const SuperadminSchema = {
  avatarUrl: null,
  id: null,
  firstName: null,
  lastName: null,
  username: null,
  activeAccountid: null,
  permissionId: null,
  twilioPhoneNumber: null,
  role: null,
  sendBookingRequestEmail: false,
  isSSO: null,
};

export default class Superadmin extends createModel(SuperadminSchema, 'Superadmin') {
  /**
   * Add all TextMessage specific member functions here
   */
  getSuperadminname() {
    return this.get('username');
  }

  getName() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }
}
