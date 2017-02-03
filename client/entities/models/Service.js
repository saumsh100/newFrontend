import createModel from '../createModel';

const ServiceSchema = {
  id: null,
  accountId: null,
  name: null,
  duration: null,
  bufferTime: null,
  unitCost: null,
  customCosts: null,
  practitioners: null,
};

export default class Service extends createModel(ServiceSchema) {

}
