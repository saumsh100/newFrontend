
const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

export default function (sequelize, DataTypes) {
  const Reminder = sequelize.define('Reminder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    primaryType: {
      type: DataTypes.ENUM,
      values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
      // TODO: maybe a default value?
      allowNull: false,
    },

    lengthSeconds: {
      type: DataTypes.INTEGER,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });

  Reminder.associate = ({ Account }) => {
    Reminder.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  };

  return Reminder;
}
