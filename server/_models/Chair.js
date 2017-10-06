const { validateAccountIdPmsId } = require('../util/validators');

export default function (sequelize, DataTypes) {
  const Chair = sequelize.define('Chair', {
    id: {
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
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(Chair, value, this, next);
        },
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Chair.associate = ({ Account }) => {
    Chair.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  };

  return Chair;
}
