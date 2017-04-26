
import createModel from '../createModel';

const PermissionSchema = {
  accountId: null,
  role: null,
  id: null,
  permissions: null,
};

export default class Permission extends createModel(PermissionSchema) {
  getUrlRoot() {
    return '/api/permissions';
  }
}
