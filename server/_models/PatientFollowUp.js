
export default function (sequelize, DataTypes) {
  const PatientFollowUp = sequelize.define(
    'PatientFollowUp',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      patientFollowUpTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      dueAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      assignedUserId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { paranoid: false },
  );

  PatientFollowUp.associate = ({ Patient, Account, User }) => {
    PatientFollowUp.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    PatientFollowUp.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    PatientFollowUp.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });

    PatientFollowUp.belongsTo(User, {
      foreignKey: 'assignedUserId',
      as: 'assignedUser',
    });
  };

  return PatientFollowUp;
}
