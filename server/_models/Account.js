
import moment from 'moment';
import customDataTypes from '../util/customDataTypes';
import globals, { env } from '../config/globals';
import { sendConnectorBackUp } from '../lib/mail';

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

    weeklyScheduleId: { type: DataTypes.UUID },

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

    callrailId: { type: DataTypes.INTEGER },

    vendastaAccountId: { type: DataTypes.STRING },

    vendastaMsId: { type: DataTypes.STRING },

    vendastaSrId: { type: DataTypes.STRING },

    vendastaId: { type: DataTypes.STRING },

    timeInterval: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },

    timezone: { type: DataTypes.STRING },

    twilioPhoneNumber: customDataTypes.phoneNumber('twilioPhoneNumber', DataTypes),
    destinationPhoneNumber: customDataTypes.phoneNumber('destinationPhoneNumber', DataTypes),
    phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes),

    contactEmail: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
    },

    website: { type: DataTypes.STRING },

    logo: { type: DataTypes.STRING },

    fullLogoUrl: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['logo']),
      get() {
        return this.get('logo') ? `${globals.s3.urlPrefix}${this.get('logo')}` : null;
      },
    },

    clinicName: { type: DataTypes.STRING },

    bookingWidgetPrimaryColor: { type: DataTypes.STRING },

    syncClientAdapter: { type: DataTypes.STRING },

    lastSyncDate: { type: DataTypes.DATE },

    massOnlineEmailSentDate: { type: DataTypes.DATE },

    googlePlaceId: { type: DataTypes.STRING },

    facebookUrl: { type: DataTypes.STRING },

    recallInterval: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '6 months',
    },

    hygieneInterval: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '6 months',
    },

    recallBuffer: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1 days',
    },

    bumpInterval: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '2 weeks',
    },

    recallStartTime: {
      type: DataTypes.TIME,
      defaultValue: '17:00:00',
    },

    recallEndTime: {
      type: DataTypes.TIME,
      defaultValue: '20:00:00',
    },

    reviewsInterval: {
      type: DataTypes.STRING,
      defaultValue: '15 minutes',
    },

    suggestedChairId: { type: DataTypes.UUID },

    sendUnconfirmedReviews: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    lastReviewInterval: {
      type: DataTypes.STRING,
      defaultValue: '1 years',
    },

    lastSentReviewInterval: {
      type: DataTypes.STRING,
      defaultValue: '1 months',
    },

    isChairSchedulingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    omitChairIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
      allowNull: false,
    },

    omitPractitionerIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
      allowNull: false,
    },

    canAutoRespondOutsideOfficeHours: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    bufferBeforeOpening: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bufferAfterClosing: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    cellPhoneNumberFallback: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [
        'mobilePhoneNumber',
        'otherPhoneNumber',
        'homePhoneNumber',
      ],
      allowNull: false,
    },

    autoRespondOutsideOfficeHoursLimit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Account.associate = (models) => {
    const {
      Address,
      Appointment,
      Chair,
      Chat,
      Enterprise,
      Patient,
      Practitioner,
      Reminder,
      Recall,
      WeeklySchedule,
      Review,
      SentReview,
      Service,
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

    Account.belongsTo(Chair, {
      foreignKey: 'suggestedChairId',
      as: 'suggestedChair',
    });

    Account.hasMany(Appointment, {
      foreignKey: 'accountId',
      as: 'appointments',
    });

    Account.hasMany(Chat, {
      foreignKey: 'accountId',
      as: 'chats',
    });

    Account.hasMany(Chair, {
      foreignKey: 'accountId',
      as: 'chairs',
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
    const { Address } = models;

    Account.addScope('defaultScope', {
      include: [{
        model: Address,
        as: 'address',
      }],
    }, { override: true });
  };

  Account.modelHooks = (() => {
    /**
     * This hook will be triggered whenever there is a change to cellPhoneNumberFallback,
     * it will then update all patients' cellPhoneNumber column with this new fallback order
     */
    Account.hook('beforeUpdate', ({ cellPhoneNumberFallback, _previousDataValues, id }) => {
      const { cellPhoneNumberFallback: prevCellPhoneNumberFallback } = _previousDataValues;
      if (JSON.stringify(cellPhoneNumberFallback) !== JSON.stringify(prevCellPhoneNumberFallback)) {
        sequelize.query(`UPDATE "Patients"
        SET
          "cellPhoneNumber" = COALESCE("${cellPhoneNumberFallback.join('","')}")
        WHERE "accountId" = '${id}'
        AND ("cellPhoneNumber" != 
          COALESCE("${cellPhoneNumberFallback.join('","')}") 
          OR "cellPhoneNumber" IS NULL
          OR COALESCE("${cellPhoneNumberFallback.join('","')}") IS NULL)
        AND "deletedAt" IS NULL`);
      }
    });
  });

  return Account;
}
