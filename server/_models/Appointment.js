
export default function (sequelize, DataTypes) {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    practitionerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
    },

    serviceId: {
      type: DataTypes.UUID,
    },

    chairId: {
      type: DataTypes.UUID,
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    note: {
      type: DataTypes.STRING,
    },

    isReminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isPatientConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isSyncedWithPMS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    customBufferTime: {
      type: DataTypes.INTEGER,
    },

    mark: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['patientId']),
      get() {
        return !this.get('patientId');
      },
    },
  });

  Appointment.associate = (({ Account, Chair, Patient, Practitioner, Service }) => {
    Appointment.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Appointment.belongsTo(Chair, {
      foreignKey: 'chairId',
      as: 'chair',
    });

    Appointment.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    Appointment.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });

    Appointment.belongsTo(Service, {
      foreignKey: 'serviceId',
      as: 'service',
    });
  });

  return Appointment;
}
