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


    availableDates: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },

    availableTimes: {
      type: DataTypes.ARRAY(DataTypes.DATE),
    },

    endDate: {
      type: DataTypes.DATE,
    },

    appointmentId: {
      type: DataTypes.UUID,
    },

    reasonId: {
      type: DataTypes.UUID,
    },

    practitionerId: {
      type: DataTypes.UUID,
    },
  });

  WaitSpot.associate = ({
    Appointment, Account, Patient, PatientUser, Practitioner, Service,
  }) => {
    WaitSpot.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    WaitSpot.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    WaitSpot.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    WaitSpot.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });
    WaitSpot.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });

    WaitSpot.belongsTo(Service, {
      foreignKey: 'reasonId',
      as: 'reason',
    });
  };

  return WaitSpot;
}
