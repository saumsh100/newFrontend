
import customDataTypes from '../util/customDataTypes';

export default function (sequelize, DataTypes) {
  const TextMessage = sequelize.define('TextMessage', {
    id: {
      // Twilio MessageSID
      type: DataTypes.STRING,
      primaryKey: true,
    },

    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
    },

    // Twilio Data
    to: customDataTypes.phoneNumber('to', DataTypes, {
      allowNull: false,
    }),

    from: customDataTypes.phoneNumber('from', DataTypes, {
      allowNull: false,
    }),

    body: {
      type: DataTypes.TEXT,
    },

    smsStatus: {
      // TODO: Should this be an enum?
      type: DataTypes.STRING,
    },

    dateCreated: {
      type: DataTypes.DATE,
    },

    dateUpdated: {
      type: DataTypes.DATE,
    },

    apiVersion: {
      type: DataTypes.STRING,
    },

    accountSid: {
      type: DataTypes.STRING,
    },

    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    // Depends on carrier if populated I believe
    toZip: {
      type: DataTypes.STRING,
    },

    toCity: {
      type: DataTypes.STRING,
    },

    toState: {
      type: DataTypes.STRING,
    },

    toCountry: {
      type: DataTypes.STRING,
    },

    fromZip: {
      type: DataTypes.STRING,
    },

    fromCity: {
      type: DataTypes.STRING,
    },

    fromState: {
      type: DataTypes.STRING,
    },

    fromCountry: {
      type: DataTypes.STRING,
    },

    numMedia: {
      type: DataTypes.INTEGER,
    },

    numSegments: {
      type: DataTypes.INTEGER,
    },

    mediaData: {
      type: DataTypes.JSONB,
    },

    isOutsideOfficeHoursRespond: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  TextMessage.associate = ({ Chat, User }) => {
    TextMessage.belongsTo(Chat, {
      foreignKey: 'chatId',
      as: 'chat',
    });

    TextMessage.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return TextMessage;
}
