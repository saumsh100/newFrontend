
import createModel from '../createModel';

const ChairsSchema = {
  id: null,
  accountid: null,
  name: null,
  description: null,
  isActive: null,
};

export default class Chairs extends createModel(ChairsSchema, 'Chairs') {
  /**
   * Add all TextMessage specific member functions here
   */
  getName() {
    return this.get('name');
  }

  getUrlRoot() {
    return `/api/chairs/${this.get('id')}`;
  }
}
