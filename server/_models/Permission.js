const ROLES = {
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  SUPERADMIN: 'SUPERADMIN',
};

export default function (sequelize, DataTypes) {
  const Permission = sequelize.define('Permission', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM,
      values: Object.keys(ROLES).map(key => ROLES[key]),
      // TODO: maybe a default value?
      allowNull: false,
    },

    permissions: {
      type: DataTypes.JSONB,
    },

    canAccessAllAccounts: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    allowedAccounts: {
      type: DataTypes.ARRAY(DataTypes.UUID),
    },
  });

  Permission.ROLES = ROLES;

  return Permission;
}
