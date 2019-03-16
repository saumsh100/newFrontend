
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

    contactedPatientId: {
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

    isFamily: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isAutomated: {
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

    lengthSeconds: { type: DataTypes.INTEGER },

    interval: { type: DataTypes.STRING },

    errorCode: { type: DataTypes.STRING },
  });

  SentReminder.associate = ({ Account, Reminder, Patient, SentRemindersPatients }) => {
    SentReminder.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    SentReminder.belongsTo(Reminder, {
      foreignKey: 'reminderId',
      as: 'reminder',
    });

    SentReminder.belongsTo(Patient, {
      foreignKey: 'contactedPatientId',
      as: 'patient',
    });

    SentReminder.hasMany(SentRemindersPatients, {
      foreignKey: 'sentRemindersId',
      as: 'sentRemindersPatients',
      sourceKey: 'id',
    });
  };

  return SentReminder;
}
