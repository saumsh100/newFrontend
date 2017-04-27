import createCollection from '../createCollection';
import Invites from '../models/Invites';

export default class permissions extends createCollection(Invites) {

  getUrlRoot() {
    return '/api/Invite';
  }
}
