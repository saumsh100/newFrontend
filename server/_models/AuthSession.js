
export default function (sequelize, DataTypes) {
  const AuthSession = sequelize.define('AuthSession', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    modelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    accountId: {
      type: DataTypes.UUID,
    },

    enterpriseId: {
      type: DataTypes.UUID,
    },

    role: {
      type: DataTypes.STRING,
      // TODO: this should be an enum...
    },

    permissions: {
      type: DataTypes.JSONB,
    },
  });

  return AuthSession;
}
