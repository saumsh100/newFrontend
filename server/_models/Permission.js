
const MANAGER = 'MANAGER';
const ADMIN = 'ADMIN';
const OWNER = 'OWNER';
const SUPERADMIN = 'SUPERADMIN';

export default function (sequelize, DataTypes) {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM(
        MANAGER,
        ADMIN,
        OWNER,
        SUPERADMIN,
      ),

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

  return Permission;
}
