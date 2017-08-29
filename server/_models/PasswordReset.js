export default function (sequelize, DataTypes) {
  const PasswordReset = sequelize.define('PasswordReset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },

      allowNull: false,
    },

    token: {
      type: DataTypes.UUID,
    },
  });

  return PasswordReset;
}
