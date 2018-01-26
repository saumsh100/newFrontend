
import moment from 'moment';
import customDataTypes from '../util/customDataTypes';
import globals, { env } from '../config/globals';
import { sendConnectorBackUp } from '../lib/mail';
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
      allowNull: false,
    },

    // TODO: booleans should have allowNull=true
    canSendReminders: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // TODO: booleans should have allowNull=true
    canSendRecalls: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    sendRequestEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    canSendReviews: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    unit: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },

    callrailId: {
      type: DataTypes.INTEGER,
    },

    vendastaAccountId: {
      type: DataTypes.STRING,
    },

    vendastaMsId: {
      type: DataTypes.STRING,
    },

    vendastaSrId: {
      type: DataTypes.STRING,
    },

    vendastaId: {
      type: DataTypes.STRING,
    },

    timeInterval: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
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

    googlePlaceId: {
      type: DataTypes.STRING,
    },

    facebookUrl: {
      type: DataTypes.STRING,
    },

    recareDueDateSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 23328000,
      allowNull: false,
    },

    hygieneDueDateSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 15552000,
      allowNull: false,
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
      Review,
      SentReview,
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

    Account.hasMany(Review, {
      foreignKey: 'accountId',
      as: 'reviews',
    });

    Account.hasMany(SentReview, {
      foreignKey: 'accountId',
      as: 'sentReviews',
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

  Account.modelHooks = (({ AccountConfiguration, Configuration }) => {
    // Hook for sending email if a Connector is back up
    Account.hook('beforeUpdate', async (account) => {
      const config = await Configuration.findOne({
        where: {
          name: 'CONNECTOR_ENABLED',
        },
      });

      const accountConfig = await AccountConfiguration.findOne({
        where: {
          accountId: account.id,
          configurationId: config.id,
        },
      });

      const isEnabled = accountConfig ? accountConfig.value === '1' : config.defaultValue === '1';

      if (env === 'production' && isEnabled) {
        const newDate = account.lastSyncDate;
        const oldDate = account._previousDataValues.lastSyncDate;

        if (oldDate !== newDate) {
          const minsDiff = moment(newDate).diff(moment(oldDate), 'minutes');

          if (minsDiff > 30) {
            sendConnectorBackUp({
              toEmail: 'monitoring@carecru.com',
              name: account.name,
              mergeVars: [
                {
                  name: 'CONNECTOR_NAME',
                  content: account.name,
                },
              ],
            });
          }
        }
      }
    });
  });

  return Account;
}
