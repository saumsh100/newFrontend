
const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

export default function (sequelize, DataTypes) {
  const SentReview = sequelize.define('SentReview', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // May not be defined cause it's not easy to always have,
    // clinics might also turn off reviewing practitioners
    practitionerId: {
      type: DataTypes.UUID,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    // Hacky fix for RemindersList algo so that we don't send farther away reminders
    // after sending the short ones
    primaryType: {
      type: DataTypes.ENUM,
      values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
      // TODO: maybe a default value?
      defaultValue: PRIMARY_TYPES.EMAIL,
      allowNull: false,
    },
  });

  SentReview.associate = ({ Account, Appointment, Patient, Practitioner }) => {
    SentReview.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    SentReview.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    SentReview.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    SentReview.belongsTo(Practitioner, {
      foreignKey: 'practitionerId',
      as: 'practitioner',
    });
  };

  return SentReview;
}
