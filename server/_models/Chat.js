
import customDataTypes from '../util/customDataTypes';

export default function (sequelize, DataTypes) {
  const Chat = sequelize.define('Chat', {
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
    },

    patientPhoneNumber: customDataTypes.phoneNumber('patientPhoneNumber', DataTypes, {
      allowNull: false,
    }),

    lastTextMessageDate: {
      type: DataTypes.DATE,
    },

    lastTextMessageId: {
      type: DataTypes.UUID,
    },
  });

  Chat.associate = ({ Account, Patient, TextMessage }) => {
    Chat.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Chat.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    Chat.hasMany(TextMessage, {
      foreignKey: 'chatId',
      as: 'textMessages',
    });

    // TODO: add hasMany textMessages and hasOne lastTextMessage when done
  };

  return Chat;
}
