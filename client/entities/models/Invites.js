
import createModel from '../createModel';

const InvitesSchema = {
  id: null,
  accountid: null,
  createdAt: null,
  email: null,
  sendingUserId: null,
};

export default class Invites extends createModel(InvitesSchema, 'Invites') {
  /**
   * Add all TextMessage specific member functions here
   */
}
