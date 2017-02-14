
import createModel from '../createModel';

const ServicesSchema = {
  id: null,
  accountId: null,
  name: null,
  duration: null,
  bufferTime: null,
  unitCost: null,
  customCosts: null,
  allowedPractitioners: null,
};

export default class Services extends createModel(ServicesSchema) {
  /**
   * Add all TextMessage specific member functions here
   */

}
