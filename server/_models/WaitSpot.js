
export default function (sequelize, DataTypes) {
  const WaitSpot = sequelize.define('WaitSpot', {
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
    },

    patientUserId: {
      type: DataTypes.UUID,
    },

    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        mornings: true,
        afternoons: true,
        evenings: true,
      },
    },

    daysOfTheWeek: {
      type: DataTypes.JSONB,
      defaultValue: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      },
    },

    unavailableDays: {
      type: DataTypes.ARRAY(DataTypes.DATEONLY),
    },

    endDate: {
      type: DataTypes.DATE,
    },
  });

  WaitSpot.associate = ({ Account, Patient, PatientUser }) => {
    WaitSpot.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    WaitSpot.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    WaitSpot.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });
  };

  return WaitSpot;
}
