import createModel from '../createModel';

const EnterpriseSchema = {
  id: null,
  createdAt: null,
  name: null,
  plan: null,
  organization: null,
  csmAccountOwnerId: null,
  updatedAt: null,
};

export default class Enterprise extends createModel(EnterpriseSchema, 'Enterprise') {
  getUrlRoot() {
    return `/api/enterprises/${this.getId()}`;
  }
}
