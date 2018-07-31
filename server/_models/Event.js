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
      type: DataTypes.STRING,
    },

    action: {
      type: DataTypes.STRING,
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
