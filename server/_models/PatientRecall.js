
const { validateAccountIdPmsId } = require('../util/validators');

export default function (sequelize, DataTypes) {
  const PatientRecall = sequelize.define('PatientRecall', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(PatientRecall, value, this, next);
        },
      },
    },

    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
    },
  });

  PatientRecall.associate = (({ Account, Patient }) => {
    PatientRecall.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    PatientRecall.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  });

  return PatientRecall;
}
