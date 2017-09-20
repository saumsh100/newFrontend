export default function (sequelize, DataTypes) {
  const PatientUserReset = sequelize.define('PatientUserReset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    patientUserId: {
      type: DataTypes.UUID,
    },

    token: {
      type: DataTypes.STRING,
    },
  });

  PatientUserReset.associate = ({ PatientUser }) => {
    PatientUserReset.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });
  };

  return PatientUserReset;
}
