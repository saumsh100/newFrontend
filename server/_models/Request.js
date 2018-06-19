
export default function (sequelize, DataTypes) {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    requestingPatientUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    practitionerId: {
      type: DataTypes.UUID,
    },

    chairId: {
      type: DataTypes.UUID,
    },

    suggestedPractitionerId: {
      type: DataTypes.UUID,
    },

    suggestedChairId: {
      type: DataTypes.UUID,
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

    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    appointmentId: {
      type: DataTypes.UUID,
    },

    patientId: {
      type: DataTypes.UUID,
    },

    isSyncedWithPms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    insuranceCarrier: {
      type: DataTypes.STRING,
    },

    insuranceMemberId: {
      type: DataTypes.STRING,
    },
    
    insuranceGroupId: {
      type: DataTypes.STRING,
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    isDeleted: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['isConfirmed', 'isCancelled']),
      get() {
        return this.get('isConfirmed') || this.get('isCancelled');
      },
    },

    sentRecallId: {
      type: DataTypes.UUID,
    },
  });

  Request.associate = ({ Account, Appointment, Chair, Service, PatientUser, Practitioner, SentRecall}) => {
    Request.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Request.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    Request.belongsTo(Chair, {
      foreignKey: 'chairId',
      as: 'chair',
    });

    Request.belongsTo(Chair, {
      foreignKey: 'suggestedChairId',
      as: 'suggestedChair',
    });

    Request.belongsTo(Service, {
      foreignKey: 'serviceId',
      as: 'service',
    });

    Request.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });

    Request.belongsTo(Practitioner, {
      foreignKey: 'suggestedPractitionerId',
      as: 'suggestedPractitioner',
    });

    Request.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });

    Request.belongsTo(PatientUser, {
      foreignKey: 'requestingPatientUserId',
      as: 'requestingPatientUser',
    });

    Request.belongsTo(SentRecall, {
      foreignKey: 'sentRecallId',
      as: 'sentRecall',
    });
  };

  return Request;
}
