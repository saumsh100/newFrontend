
export default function (sequelize, DataTypes) {
  const Family = sequelize.define('Family', {
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

    pmsId: {
      type: DataTypes.STRING,
    },

    headId: {
      type: DataTypes.UUID,
    },
  });

  Family.associate = (({ Account, Patient }) => {
    Family.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Family.hasMany(Patient, {
      foreignKey: 'familyId',
      as: 'patients',
    });
  });

  return Family;
}
