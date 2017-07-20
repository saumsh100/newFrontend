
export default function (sequelize, DataTypes) {
  const Chair = sequelize.define('Chair', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },

    accountId: {
      type: DataTypes.UUIDV4,
    },

    description: {
      type: DataTypes.STRING,
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Chair;
}
