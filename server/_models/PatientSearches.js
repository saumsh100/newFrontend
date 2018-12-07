
'use strict';
export default function (sequelize, DataTypes) {
  const PatientSearches = sequelize.define('PatientSearches', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    context: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  PatientSearches.associate = ({ User, Account, Patient }) => {
    PatientSearches.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });

    PatientSearches.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    PatientSearches.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  };

  return PatientSearches;
}
