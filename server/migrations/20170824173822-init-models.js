'use strict';
const moment = require('moment-timezone')

const customDataTypes = require('../util/customDataTypes');
const globals = require('../config/globals');

function timeWithZone(hours, minutes, timezone) {
  const now = moment(new Date(Date.UTC(1970, 1, 0, hours, minutes)));
  const another = now.clone();
  another.tz(timezone);
  now.add(-1 * another.utcOffset(), 'minutes');
  return now._d;
}

module.exports = {
  up: async function (queryInterface, DataTypes) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: DataTypes.INTEGER });
    */

    const PLAN = {
      GROWTH: 'GROWTH',
      ENTERPRISE: 'ENTERPRISE',
    };

    await queryInterface.createTable('Enterprises', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // We should probably make the name unique as well later on...
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      plan: {
        type: DataTypes.ENUM,
        values: Object.keys(PLAN).map(key => PLAN[key]),
        defaultValue: PLAN.GROWTH,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const startTime = timeWithZone(8, 0, 'America/Los_Angeles');
    const endTime = timeWithZone(17, 0, 'America/Los_Angeles');

    const defaultDailySchedule = {
      isClosed: false,
      startTime,
      endTime,
      breaks: [],
      chairIds: [],
      pmsScheduleId: null,
    };

    await queryInterface.createTable('WeeklySchedules', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      startDate: {
        type: DataTypes.DATE,
      },

      isAdvanced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      monday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      tuesday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      wednesday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      thursday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      friday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      saturday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      sunday: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: defaultDailySchedule,
      },

      // TODO: remove this once we are swapped to be parentId architecture
      weeklySchedules: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable(
      'Accounts',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },

        deletedAt: {
          type: DataTypes.DATE,
        },

        enterpriseId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Enterprises',
            key: 'id',
          },
          onUpdate: 'cascade',
        },

        EnterpriseId: {
          type: DataTypes.UUID,
          references: {
            model: 'Enterprises',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        },

        weeklyScheduleId: {
          type: DataTypes.UUID,
          references: {
            model: 'WeeklySchedules',
            key: 'id',
          },
          onUpdate: 'cascade',
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

        street: {
          type: DataTypes.STRING,
        },

        country: {
          type: DataTypes.STRING,
        },

        state: {
          type: DataTypes.STRING,
        },

        city: {
          type: DataTypes.STRING,
        },

        zipCode: {
          type: DataTypes.STRING,
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

        // fullLogoUrl: {
        //   type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['logo']),
        //   get() {
        //     return this.get('logo') ? `${globals.s3.urlPrefix}${this.get('logo')}` : null;
        //   },
        // },

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
      },
    );

    const TYPE = {
      DENTIST: 'Dentist',
      HYGIENIST: 'Hygienist',
    };

    await queryInterface.createTable('Practitioners', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      pmsId: {
        type: DataTypes.STRING,
      },

      type: {
        type: DataTypes.ENUM,
        values: Object.keys(TYPE).map(key => TYPE[key]),
        defaultValue: TYPE.HYGIENIST,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      isHidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      avatarUrl: {
        type: DataTypes.STRING,
      },

      isCustomSchedule: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      weeklyScheduleId: {
        type: DataTypes.UUID,
        references: {
          model: 'WeeklySchedules',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('PatientUsers', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      patientUserId: {
        type: DataTypes.UUID,
        references: {
          model: 'PatientUsers',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes, {
        allowNull: false,
        unique: true,
      }),

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      isEmailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      isPhoneNumberConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      avatarUrl: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Families', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      pmsId: {
        type: DataTypes.STRING,
      },

      headId: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const STATUS = {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
    };

    await queryInterface.createTable('Patients', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      pmsId: {
        type: DataTypes.STRING,
      },

      // Used to connect authenticated patientUser to his patient record
      // in the PMS
      patientUserId: {
        type: DataTypes.UUID,
        references: {
          model: 'PatientUsers',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      middleName: {
        type: DataTypes.STRING,
      },

      phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes),
      homePhoneNumber: customDataTypes.phoneNumber('homePhoneNumber', DataTypes),
      mobilePhoneNumber: customDataTypes.phoneNumber('mobilePhoneNumber', DataTypes),
      workPhoneNumber: customDataTypes.phoneNumber('workPhoneNumber', DataTypes),
      otherPhoneNumber: customDataTypes.phoneNumber('otherPhoneNumber', DataTypes),

      prefContactPhone: {
        // TODO: this should be an enum
        type: DataTypes.STRING,
      },

      gender: {
        // TODO: needs to be an enum
        type: DataTypes.STRING,
      },

      prefName: {
        type: DataTypes.STRING,
      },

      language: {
        // TODO: needs to be an enum
        type: DataTypes.STRING,
      },

      // TODO: needs to be a separate table
      address: {
        // TODO: for now just use nested JSON
        type: DataTypes.JSONB,
      },

      // TODO: needs to be a separate table
      preferences: {
        type: DataTypes.JSONB,
        defaultValue: {
          morning: true,
          afternoon: true,
          evening: true,
          weekdays: true,
          weekends: true,
          sms: true,
          emailNotifications: true,
          phone: true,
          reminders: true,
          newsletter: true,
          birthdayMessage: true,
        },
      },

      // TODO: what is this for?
      type: {
        type: DataTypes.STRING,
      },

      birthDate: {
        type: DataTypes.DATE,
      },

      // TODO: should be a seperate table
      insurance: {
        type: DataTypes.JSONB,
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isSyncedWithPMS: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      familyId: {
        type: DataTypes.UUID,
        references: {
          model: 'Families',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      status: {
        type: DataTypes.ENUM,
        values: Object.keys(STATUS).map(key => STATUS[key]),
        defaultValue: STATUS.ACTIVE,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.removeIndex(
      'Patients',
      ['accountId', 'email'],
      {
        indicesType: 'UNIQUE',
      },
    );

    await queryInterface.removeIndex(
      'Patients',
      ['accountId', 'mobilePhoneNumber'],
      {
        indicesType: 'UNIQUE',
      },
    );

    await queryInterface.addIndex(
      'Patients',
      ['accountId', 'email'],
      {
        indicesType: 'UNIQUE',
      },
    );

    await queryInterface.addIndex(
      'Patients',
      ['accountId', 'mobilePhoneNumber'],
      {
        indicesType: 'UNIQUE',
      },
    );

    await queryInterface.createTable('Services', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      pmsId: {
        type: DataTypes.STRING,
      },

      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      bufferTime: {
        type: DataTypes.INTEGER,
      },

      unitCost: {
        // TODO: is this correct?
        type: DataTypes.INTEGER,
      },

      isHidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Chairs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      description: {
        type: DataTypes.STRING,
      },

      pmsId: {
        type: DataTypes.STRING,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Appointments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      practitionerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Practitioners',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      serviceId: {
        type: DataTypes.UUID,
        references: {
          model: 'Services',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      chairId: {
        type: DataTypes.UUID,
        references: {
          model: 'Chairs',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      pmsId: {
        type: DataTypes.STRING,
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      isBookable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      note: {
        type: DataTypes.TEXT,
      },

      isReminderSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      isPatientConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      isSyncedWithPMS: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      isCancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      customBufferTime: {
        type: DataTypes.INTEGER,
      },

      // mark: {
      //   type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['patientId']),
      //   get() {
      //     return !this.get('patientId');
      //   },
      // },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('AuthSessions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      modelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      accountId: {
        type: DataTypes.UUID,
      },

      enterpriseId: {
        type: DataTypes.UUID,
      },

      role: {
        type: DataTypes.STRING,
        // TODO: this should be an enum...
      },

      permissions: {
        type: DataTypes.JSONB,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });


    await queryInterface.createTable('Calls', {
      id: {
        //  CallRail ID
        type: DataTypes.STRING,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      dateTime: {
        type: DataTypes.DATE,
      },

      answered: {
        type: DataTypes.BOOLEAN,
      },

      voicemail: {
        type: DataTypes.BOOLEAN,
      },

      wasApptBooked: {
        type: DataTypes.BOOLEAN,
      },

      direction: {
        type: DataTypes.STRING,
      },

      duration: {
        type: DataTypes.INTEGER,
      },

      priorCalls: {
        type: DataTypes.INTEGER,
      },

      recording: {
        type: DataTypes.STRING,
      },

      recordingDuration: {
        type: DataTypes.STRING,
      },

      startTime: {
        type: DataTypes.DATE,
      },

      totalCalls: {
        type: DataTypes.INTEGER,
      },

      callerCity: {
        type: DataTypes.STRING,
      },

      callerCountry: {
        type: DataTypes.STRING,
      },

      callerName: {
        type: DataTypes.STRING,
      },

      callerNum: {
        type: DataTypes.STRING,
      },

      callerZip: {
        type: DataTypes.STRING,
      },

      callerState: {
        type: DataTypes.STRING,
      },

      campaign: {
        type: DataTypes.STRING,
      },

      destinationNum: customDataTypes.phoneNumber('destinationNum', DataTypes),
      trackingNum: customDataTypes.phoneNumber('trackingNum', DataTypes),

      callSource: {
        // TODO: should this be an ENUM?
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Chats', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      patientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientPhoneNumber: customDataTypes.phoneNumber('patientPhoneNumber', DataTypes, {
        allowNull: false,
      }),

      lastTextMessageDate: {
        type: DataTypes.DATE,
      },

      lastTextMessageId: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const ROLES = {
      MANAGER: 'MANAGER',
      ADMIN: 'ADMIN',
      OWNER: 'OWNER',
      SUPERADMIN: 'SUPERADMIN',
    };

    await queryInterface.createTable('Permissions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      role: {
        type: DataTypes.ENUM,
        values: Object.keys(ROLES).map(key => ROLES[key]),
        // TODO: maybe a default value?
        allowNull: false,
      },

      permissions: {
        type: DataTypes.JSONB,
      },

      canAccessAllAccounts: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },

      allowedAccounts: {
        type: DataTypes.ARRAY(DataTypes.UUID),
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      activeAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      enterpriseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Enterprises',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      avatarUrl: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const ROLES2 = {
      MANAGER: 'MANAGER',
      ADMIN: 'ADMIN',
      OWNER: 'OWNER',
    };

    await queryInterface.createTable('Invites', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      enterpriseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Enterprises',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      sendingUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      role: {
        type: DataTypes.ENUM,
        values: Object.keys(ROLES2).map(key => ROLES2[key]),
        defaultValue: 'MANAGER',
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },

        allowNull: false,
      },

      token: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const code4 = () => Math.floor(1000 + (Math.random() * 9000)).toString();

    await queryInterface.createTable('PinCodes', {
      pinCode: {
        type: DataTypes.STRING,
        primaryKey: true,
        // We gotta make sure we remove these or else PK will conflict
        defaultValue: () => code4(),
      },

      modelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Practitioner_Services', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      practitionerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Practitioners',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('PractitionerRecurringTimeOffs', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      practitionerId: {
        type: DataTypes.UUID,
        references: {
          model: 'Practitioners',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      startTime: {
        type: DataTypes.DATE,
      },

      endTime: {
        type: DataTypes.DATE,
      },

      interval: {
        type: DataTypes.INTEGER,
      },

      allDay: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      fromPMS: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      dayOfWeek: {
        type: DataTypes.ENUM,
        values: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },

      note: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const PRIMARY_TYPES = {
      PHONE: 'phone',
      EMAIL: 'email',
      SMS: 'sms',
    };

    await queryInterface.createTable('Recalls', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Reminders', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Requests', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'PatientUsers',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      practitionerId: {
        type: DataTypes.UUID,
        references: {
          model: 'Practitioners',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      chairId: {
        type: DataTypes.UUID,
        references: {
          model: 'Chairs',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      note: {
        type: DataTypes.STRING,
      },

      isConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      isCancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      appointmentId: {
        type: DataTypes.UUID,
        references: {
          model: 'Appointments',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const REFERENCE = {
      ENTERPRISE: 'enterprise',
      ACCOUNT: 'account',
    };

    await queryInterface.createTable('Segments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 255],
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      referenceId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
        },
      },

      reference: {
        type: DataTypes.ENUM,
        values: Object.keys(REFERENCE).map(key => REFERENCE[key]),
        allowNull: false,
      },

      where: {
        type: DataTypes.JSONB,
        allowNull: false,
      },

      rawWhere: {
        type: DataTypes.JSONB,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('SentRecalls', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      recallId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Recalls',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },


      isSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      // Hacky fix for RemindersList algo so that we don't send farther away reminders
      // after sending the short ones
      primaryType: {
        type: DataTypes.ENUM,
        values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
        // TODO: maybe a default value?
        allowNull: false,
      },

      lengthSeconds: {
        type: DataTypes.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('SentReminders', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      reminderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Reminders',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      appointmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Appointments',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      isSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      isConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      // Hacky fix for RemindersList algo so that we don't send farther away reminders
      // after sending the short ones
      primaryType: {
        type: DataTypes.ENUM,
        values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
        // TODO: maybe a default value?
        allowNull: false,
      },

      lengthSeconds: {
        type: DataTypes.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    const OPERATIONS = {
      CREATE: 'create',
      UPDATE: 'update',
      DELETE: 'delete',
      SYNC: 'sync',
    };

    await queryInterface.createTable('SyncClientErrors', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      syncId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      version: {
        type: DataTypes.STRING,
      },

      adapter: {
        type: DataTypes.STRING,
      },

      operation: {
        type: DataTypes.ENUM,
        values: Object.keys(OPERATIONS).map(key => OPERATIONS[key]),
        // TODO: maybe a default value?
        allowNull: false,
      },

      success: {
        type: DataTypes.BOOLEAN,
      },

      model: {
        type: DataTypes.STRING,
      },

      documentId: {
        type: DataTypes.STRING,
      },

      payload: {
        type: DataTypes.TEXT('long'),
      },

      customErrorMsg: {
        type: DataTypes.TEXT('long'),
      },

      errorMessage: {
        type: DataTypes.TEXT('long'),
      },

      stackTrace: {
        type: DataTypes.TEXT('long'),
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('SyncClientVersions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      major: {
        type: DataTypes.FLOAT,
      },

      minor: {
        type: DataTypes.FLOAT,
      },

      patch: {
        type: DataTypes.FLOAT,
      },

      build: {
        type: DataTypes.FLOAT,
      },

      url: {
        type: DataTypes.STRING,
      },

      key: {
        type: DataTypes.STRING,
      },

      secret: {
        type: DataTypes.STRING,
      },

      filename: {
        type: DataTypes.STRING,
      },

      path: {
        type: DataTypes.STRING,
      },

      bucket: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('TextMessages', {
      id: {
        // Twilio MessageSID
        type: DataTypes.STRING,
        primaryKey: true,
      },

      chatId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Chats',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },

      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      // Twilio Data
      to: customDataTypes.phoneNumber('to', DataTypes, {
        allowNull: false,
      }),

      from: customDataTypes.phoneNumber('from', DataTypes, {
        allowNull: false,
      }),

      body: {
        type: DataTypes.STRING,
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

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Tokens', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      appointmentId: {
        type: DataTypes.UUID,
        references: {
          model: 'Appointments',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientUserId: {
        type: DataTypes.UUID,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable('WaitSpots', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      patientUserId: {
        type: DataTypes.UUID,
        references: {
          model: 'PatientUsers',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      preferences: {
        type: DataTypes.JSONB,
        defaultValue: {
          mornings: true,
          afternoons: true,
          evenings: true,
          weekdays: true,
          weekends: true,
        },
      },

      unavailableDays: {
        type: DataTypes.ARRAY(DataTypes.DATEONLY),
      },

      endDate: {
        type: DataTypes.DATE,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });

    // {
    //   // Model Config
    //   indexes: [
    //     {
    //       unique: true,
    //       fields: ['accountId', 'email'],
    //     },
    //     {
    //       unique: true,
    //       fields: ['accountId', 'mobilePhoneNumber'],
    //     },
    //   ],
    // };

  },

  down: async function (queryInterface, DataTypes) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropAllTables();
  },
};
