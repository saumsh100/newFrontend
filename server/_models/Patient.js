
const ACTIVE = 'Active';
const INACTIVE = 'Inactive';

export default function (sequelize, DataTypes) {
  const Patient = sequelize.define('Patient', {
    id: {
      // TODO: why not use type UUIDV4
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

    // Used to connect authenticated patientUser to his patient record
    // in the PMS
    patientUserId: {
      type: DataTypes.UUID,
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

    phoneNumber: {
      type: DataTypes.STRING,
    },

    homePhoneNumber: {
      type: DataTypes.STRING,
    },

    mobilePhoneNumber: {
      type: DataTypes.STRING,
    },

    workPhoneNumber: {
      type: DataTypes.STRING,
    },

    otherPhoneNumber: {
      type: DataTypes.STRING,
    },

    prefPhoneNumber: {
      type: DataTypes.STRING,
    },

    notes: {
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
        email: true,
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
    },

    status: {
      type: DataTypes.ENUM(
        ACTIVE,
        INACTIVE
      ),

      defaultValue: ACTIVE,
    },
  });

  return Patient;
}
