
import merge from 'lodash/merge';
import rolePermissions from '../config/permissions';
import { Permission } from '../models';

const loadPermissions = (user) => {
  return Permission.get(user.permissionId)
    .then((permission) => {
      // TODO: this should be done on the auth middleware
      /*const { role, permissions } = permission;
      permission.permissions = merge(
        {},
        permissions,
        rolePermissions[role]
      );*/

      return permission;
    })
    .catch(() => {
      return Promise.reject({ name: 'NoUserPermisson', message: 'User does not have a Permission.' });
    });
};

export default loadPermissions;
