import rolePermissions from '../config/permissions';
import { Permission, EnterprisePermission } from '../models';

const getEmailDomain = email => (([, domain]) => domain)(/@(.+)$/.exec(email));
const isCarecruEmail = email => getEmailDomain(email) === 'carecru.com';

const loadPermissions = (user, customParams = {}) => {
  const { id, username, activeAccountId, enterpriseId: userEnterpriseId } = user;
  const { customAccountId, customEnterpriseId } = customParams;

  const accountId = customAccountId || activeAccountId;
  const enterpriseId = customEnterpriseId || userEnterpriseId;

  return Promise.all([
    Permission.filter({ accountId, userId: id }).run(),
    EnterprisePermission.filter({ enterpriseId, userId: id }).run(),
  ])
    .then(([[accountPermissions], [enterprisePermission]]) => {
      const isSuperAdmin = isCarecruEmail(username);

      if (!isSuperAdmin && !accountPermissions) {
        return Promise.reject({ name: 'NoUserRole', message: 'User have not account permissions.' });
      }

      const role = isSuperAdmin ? 'SUPERADMIN' : accountPermissions.role;
      const additionalPermissions = isSuperAdmin ? {} : (accountPermissions.permissions || {});

      const permissions = { ...rolePermissions[role], ...(additionalPermissions) };
      const enterpriseRole = (enterprisePermission && enterprisePermission.role) || null;

      return { role, permissions, enterpriseId, enterpriseRole };
    });
};

export default loadPermissions;
