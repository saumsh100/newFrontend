
const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

export default function (sequelize, DataTypes) {
  const SentReminder = sequelize.define('SentReminder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    reminderId: {
      type: DataTypes.UUID,
      allowNull: false,
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

    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isConfirmable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    // Hacky fix for RemindersList algo so that we don't send farther away reminders
    // after sending the short ones
    primaryType: {
      type: DataTypes.ENUM,
      values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
      // TODO: maybe a default value?
      allowNull: false,
    },

    lengthSeconds: {
      type: DataTypes.INTEGER,
    },

    interval: {
      type: DataTypes.STRING,
    },
  });

  SentReminder.associate = ({ Account, Appointment, Reminder, Patient }) => {
    SentReminder.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    SentReminder.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    SentReminder.belongsTo(Reminder, {
      foreignKey: 'reminderId',
      as: 'reminder',
    });

    SentReminder.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  };

  return SentReminder;
}
