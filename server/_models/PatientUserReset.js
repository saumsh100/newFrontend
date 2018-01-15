export default function (sequelize, DataTypes) {
  const PatientUserReset = sequelize.define('PatientUserReset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    token: {
      type: DataTypes.STRING,
    },

    patientUserId: {
      type: DataTypes.UUID,
    },

    accountId: {
      type: DataTypes.UUID,
    },
  });

  PatientUserReset.associate = ({ Account, PatientUser }) => {
    PatientUserReset.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });

    PatientUserReset.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  };

  return PatientUserReset;
}
