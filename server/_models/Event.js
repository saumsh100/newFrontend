
const TYPE = {
  APPOINTMENT: 'Appointment',
  CALL: 'Call',
  REMINDER: 'Reminder',
};

const ACTION = {
  CREATE: 'Create',
  READ: 'Read',
  UPDATE: 'Update',
  DELETE: 'Delete',
};

export default function (sequelize, DataTypes) {
  const Event = sequelize.define('Event', {
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
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM,
      values: Object.keys(TYPE).map(key => TYPE[key]),
    },

    action: {
      type: DataTypes.ENUM,
      values: Object.keys(ACTION).map(key => ACTION[key]),
    },

    metaData: {
      type: DataTypes.JSONB,
    },
  });

  Event.associate = ({ Account, Patient }) => {
    Event.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
    Event.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  };

  return Event;
}
