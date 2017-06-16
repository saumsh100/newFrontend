
import createModel from '../createModel';

const ServiceSchema = {
  id: null,
  createdAt: null,
  accountId: null,
  name: null,
  duration: null,
  bufferTime: null,
  unitCost: null,
  customCosts: {},
  practitioners: [],
  allowedPractitioners: null,
  isActive: null,
};

export default class Service extends createModel(ServiceSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
  getUrlRoot() {
    return `/api/services/${this.getId()}`;
  }

}
