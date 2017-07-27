
const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

export default function (sequelize, DataTypes) {
  const SentRecall = sequelize.define('SentRecall', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    recallId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },


    isSent: {
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
      allowNull: false,
    },

    lengthSeconds: {
      type: DataTypes.INTEGER,
    },
  });

  SentRecall.associate = ({ Account, Recall, Patient }) => {
    SentRecall.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    SentRecall.belongsTo(Recall, {
      foreignKey: 'recallId',
      as: 'recall',
    });

    SentRecall.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  };

  return SentRecall;
}
