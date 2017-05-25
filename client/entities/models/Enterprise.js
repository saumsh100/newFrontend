
import createModel from '../createModel';

const EnterpriseSchema = {
  id: null,
  createdAt: null,
  name: null,
};

export default class Enterprise extends createModel(EnterpriseSchema) {
  getUrlRoot() {
    return `/api/enterprises/${this.getId()}`;
  }
}
