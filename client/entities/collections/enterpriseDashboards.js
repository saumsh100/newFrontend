
import createCollection from '../createCollection';
import EnterpriseDashboard from '../models/EnterpriseDashboard';

export default class enterprises extends createCollection(EnterpriseDashboard) {
  /**
   * Add all Patient specific member functions here
   */
  getUrlRoot() {
    return '/api/enterpriseDashboard';
  }
}
