
import customDataTypes from '../util/customDataTypes';
import globals from '../config/globals';
import AddressModel from './Address';

export default function (sequelize, DataTypes) {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    enterpriseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    weeklyScheduleId: {
      type: DataTypes.UUID,
    },

    addressId: {
      type: DataTypes.UUID,
    },

    canSendReminders: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    canSendRecalls: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    unit: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },

    vendastaId: {
      type: DataTypes.STRING,
    },

    timeInterval: {
      type: DataTypes.INTEGER,
    },

    timezone: {
      type: DataTypes.STRING,
    },

    twilioPhoneNumber: customDataTypes.phoneNumber('twilioPhoneNumber', DataTypes),
    destinationPhoneNumber: customDataTypes.phoneNumber('destinationPhoneNumber', DataTypes),
    phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes),

    contactEmail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },

    website: {
      type: DataTypes.STRING,
    },

    logo: {
      type: DataTypes.STRING,
    },

    fullLogoUrl: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['logo']),
      get() {
        return this.get('logo') ? `${globals.s3.urlPrefix}${this.get('logo')}` : null;
      },
    },

    clinicName: {
      type: DataTypes.STRING,
    },

    bookingWidgetPrimaryColor: {
      type: DataTypes.STRING,
    },

    syncClientAdapter: {
      type: DataTypes.STRING,
    },

    lastSyncDate: {
      type: DataTypes.DATE,
    },
  });

  Account.associate = (models) => {
    const {
      Address,
      Appointment,
      Chat,
      Enterprise,
      Patient,
      Practitioner,
      Reminder,
      Recall,
      Service,
      WeeklySchedule,
    } = models;

    Account.belongsTo(Enterprise, {
      foreignKey: 'enterpriseId',
      as: 'enterprise',
    });

    Account.belongsTo(WeeklySchedule, {
      foreignKey: 'weeklyScheduleId',
      as: 'weeklySchedule',
    });

    Account.belongsTo(Address, {
      foreignKey: 'addressId',
      as: 'address',
    });

    Account.hasMany(Appointment, {
      foreignKey: 'accountId',
      as: 'appointments',
    });

    Account.hasMany(Chat, {
      foreignKey: 'accountId',
      as: 'chats',
    });

    Account.hasMany(Patient, {
      foreignKey: 'accountId',
      as: 'patients',
    });

    Account.hasMany(Practitioner, {
      foreignKey: 'accountId',
      as: 'practitioners',
    });

    Account.hasMany(Reminder, {
      foreignKey: 'accountId',
      as: 'reminders',
    });

    Account.hasMany(Recall, {
      foreignKey: 'accountId',
      as: 'recalls',
    });

    Account.hasMany(Service, {
      foreignKey: 'accountId',
      as: 'services',
    });
  };

  Account.scopes = (models) => {
    const {
      Address,
    } = models;

    Account.addScope('defaultScope', {
      include: [{
        model: Address,
        as: 'address',
      }],
    }, { override: true });
  };
  return Account;
}
