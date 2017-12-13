
import { commsTypes } from './shared/comms';

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
      defaultValue: PRIMARY_TYPES.EMAIL,
      values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
      allowNull: false,
    },

    primaryTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false,
    },

    lengthSeconds: {
      type: DataTypes.INTEGER,
    },

    interval: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
