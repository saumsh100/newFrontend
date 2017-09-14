export default function (sequelize, DataTypes) {
  const Configuration = sequelize.define('Configuration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    defaultValue: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
    },
  });

  return Configuration;
}
