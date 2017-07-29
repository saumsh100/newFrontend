
import createModel from '../createModel';

const EnterpriseDashboardSchema = {
  id: null,
  totals: null,
  clinics: null,
};

export default class EnterpriseDashboard extends createModel(EnterpriseDashboardSchema) {
  getUrlRoot() {
    return `/api/enterprises/dashboard/${this.getId()}`;
  }
}
