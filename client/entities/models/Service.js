import createModel from '../createModel';

const ServiceSchema = {
  id: null,
  accountId: null,
  name: null,
  duration: null,
  bufferTime: null,
  unitCost: null,
  customCosts: null,
};

export default class Service extends createModel(ServiceSchema) {

}
