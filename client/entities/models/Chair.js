
import createModel from '../createModel';

const ChairsSchema = {
  id: null,
  accountid: null,
  name: null,
  description: null,
};

export default class Chairs extends createModel(ChairsSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
  getName(){
    return this.get('name');
  }
}