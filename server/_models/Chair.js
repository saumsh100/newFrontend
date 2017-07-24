
export default function (sequelize, DataTypes) {
  const Chair = sequelize.define('Chair', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
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

  Chair.associate = (({ Account }) => {
    Chair.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  });

  return Chair;
}
