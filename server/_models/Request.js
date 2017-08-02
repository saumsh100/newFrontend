
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
  });

  Request.associate = ({ Account, Appointment, Chair, Service, PatientUser, Practitioner }) => {
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

    Request.belongsTo(Service, {
      foreignKey: 'serviceId',
      as: 'service',
    });

    Request.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });

    Request.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });
  };

  return Request;
}
