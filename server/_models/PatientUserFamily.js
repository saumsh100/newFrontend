
export default function (sequelize, DataTypes) {
  const PatientUserFamily = sequelize.define('PatientUserFamily', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    headId: {
      type: DataTypes.STRING,
    },
  });

  PatientUserFamily.associate = (({ PatientUser }) => {
    PatientUserFamily.hasMany(PatientUser, {
      foreignKey: 'patientUserFamilyId',
      as: 'patientUsers',
    });
  });

  return PatientUserFamily;
}
