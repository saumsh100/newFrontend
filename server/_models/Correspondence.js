const { validateAccountIdPmsId } = require('../util/validators');


/**
 * Keeps track of Correspondence history with a Patient
 * @param sequelize
 * @param DataTypes
 */
export default function (sequelize, DataTypes) {
  const Correspondence = sequelize.define('Correspondence', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    pmsId: {
      type: DataTypes.STRING,
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(Correspondence, value, this, next);
        },
      },
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    appointmentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    sentReminderId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    sentRecallId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    method: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    pmsType: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contactedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isSyncedWithPms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  Correspondence.RECALL_SENT_TYPE = 'RECALL:SENT';
  Correspondence.REMINDER_SENT_TYPE = 'REMINDER:SENT';
  Correspondence.REMINDER_CONFIRMED_TYPE = 'REMINDER:CONFIRMED';

  Correspondence.RECALL_SENT_NOTE = 'Sent Recall via CareCru';
  Correspondence.REMINDER_SENT_NOTE = 'Sent Appointment Reminder via CareCru';
  Correspondence.REMINDER_CONFIRMED_NOTE = 'Patient Confirmed their Appointment via CareCru';

  Correspondence.associate = ({ Account, Appointment, Patient, SentRecall, SentReminder }) => {
    Correspondence.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Correspondence.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    Correspondence.belongsTo(SentRecall, {
      foreignKey: 'sentRecallId',
      as: 'sentRecall',
    });

    Correspondence.belongsTo(SentReminder, {
      foreignKey: 'sentReminderId',
      as: 'sentReminder',
    });

    Correspondence.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  };

  return Correspondence;
}
