
import createModel from '../createModel';

const ServiceSchema = {
  accountId: null,
  allowedPractitioners: null,
  bufferTime: null,
  createdAt: null,
  customCosts: {},
  description: null,
  duration: null,
  id: null,
  isDefault: null,
  isHidden: null,
  name: null,
  practitioners: null,
  reasonWeeklyHoursId: null,
  unitCost: null,
};

export default class Service extends createModel(ServiceSchema) {
  /**
   * Add all TextMessage specific member functions here
   */
  getUrlRoot() {
    return `/api/services/${this.getId()}`;
  }
}
