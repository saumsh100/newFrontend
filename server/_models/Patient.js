
import uniqWith from 'lodash/uniqWith';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import customDataTypes from '../util/customDataTypes';
import convertToCommsPreferences from '../util/convertToCommsPreferences';
import { UniqueFieldError } from './errors';

const { validateAccountIdPmsId } = require('../util/validators');

const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export default function (sequelize, DataTypes) {
  const Patient = sequelize.define('Patient', {
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
      validate: {
        // validator for if pmsId and accountId are a unique combo
        isUnique(value, next) {
          return validateAccountIdPmsId(Patient, value, this, next);
        },
      },
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

    phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes),
    homePhoneNumber: customDataTypes.phoneNumber('homePhoneNumber', DataTypes),
    mobilePhoneNumber: customDataTypes.phoneNumber('mobilePhoneNumber', DataTypes),
    workPhoneNumber: customDataTypes.phoneNumber('workPhoneNumber', DataTypes),
    otherPhoneNumber: customDataTypes.phoneNumber('otherPhoneNumber', DataTypes),

    prefContactPhone: {
      // TODO: this should be an enum
      type: DataTypes.STRING,
    },

    /* notes: {
      type: DataTypes.STRING,
    },*/

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
      defaultValue: {},
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
        recalls: true,
        newsletter: true,
        birthdayMessage: true,
        reviews: true,
        referrals: true,
      },
    },

    // TODO: what is this for?
    type: {
      type: DataTypes.STRING,
    },

    contactMethodNote: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('contactMethodNote', val);

        // Parse notes to smart-determine comms prefs
        const oldPrefs = this.getDataValue('preferences');
        const smartPrefs = convertToCommsPreferences(val);
        const newPrefs = Object.assign({}, oldPrefs, smartPrefs);
        this.setDataValue('preferences', newPrefs);
      }
    },

    birthDate: {
      type: DataTypes.DATE,
    },

    pmsCreatedAt: {
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

    isSyncedWithPms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isSyncedWithPMS: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['isSyncedWithPms']),
      get() {
        return !!this.get('isSyncedWithPms');
      },
      set(value) {
        this.setDataValue('isSyncedWithPms', value);
      },
    },

    familyId: {
      type: DataTypes.UUID,
    },

    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUS).map(key => STATUS[key]),
      defaultValue: STATUS.ACTIVE,
    },

    lastApptId: {
      type: DataTypes.UUID,
    },

    lastApptDate: {
      type: DataTypes.DATE,
    },

    lastHygieneDate: {
      type: DataTypes.DATE,
    },

    lastHygieneApptId: {
      type: DataTypes.UUID,
    },

    lastRecallDate: {
      type: DataTypes.DATE,
    },

    lastRecallApptId: {
      type: DataTypes.UUID,
    },

    dueForRecallExamDate: {
      type: DataTypes.DATE,
    },

    recallPendingAppointmentId: {
      type: DataTypes.UUID,
    },

    dueForHygieneDate: {
      type: DataTypes.DATE,
    },

    hygienePendingAppointmentId: {
      type: DataTypes.UUID,
    },

    lastRestorativeDate: {
      type: DataTypes.DATE,
    },

    lastRestorativeApptId: {
      type: DataTypes.UUID,
    },

    firstApptId: {
      type: DataTypes.UUID,
    },

    firstApptDate: {
      type: DataTypes.DATE,
    },

    nextApptId: {
      type: DataTypes.UUID,
    },

    nextApptDate: {
      type: DataTypes.DATE,
    },

    insuranceInterval: {
      type: DataTypes.STRING,
    },

    contCareInterval: {
      type: DataTypes.STRING,
    },

    avatarUrl: {
      type: DataTypes.STRING,
    },
  }, {
    // Model Config
    indexes: [
      {
        unique: true,
        fields: ['accountId', 'email'],
      },
      {
        unique: true,
        fields: ['accountId', 'mobilePhoneNumber'],
      },
    ],
  });

  Patient.associate = ({ Account, Appointment, Chat, SentRecall, DeliveredProcedure, Review, SentReview, SentReminder, PatientUser, Family }) => {

    Patient.belongsTo(Family, {
      foreignKey: 'familyId',
      as: 'family',
    });

    Patient.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Patient.hasMany(Appointment, {
      foreignKey: 'patientId',
      as: 'appointments',
    });

    Patient.belongsTo(Appointment, {
      foreignKey: 'nextApptId',
      as: 'nextAppt',
    });

    Patient.belongsTo(Appointment, {
      foreignKey: 'lastHygieneApptId',
      as: 'lastHygieneApp',
    });

    Patient.belongsTo(Appointment, {
      foreignKey: 'lastRecallApptId',
      as: 'lastRecallApp',
    });

    Patient.belongsTo(Appointment, {
      foreignKey: 'lastRestorativeApptId',
      as: 'lastRestorativeAppt',
    });


    Patient.belongsTo(Appointment, {
      foreignKey: 'recallPendingAppointmentId',
      as: 'recallPendingAppointment',
    });

    Patient.belongsTo(Appointment, {
      foreignKey: 'hygienePendingAppointmentId',
      as: 'hygienePendingAppointment',
    });

    Patient.belongsTo(Appointment, {
      foreignKey: 'lastApptId',
      as: 'lastAppt',
    });

    Patient.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });

    Patient.hasMany(Chat, {
      foreignKey: 'patientId',
      as: 'chats',
    });

    Patient.hasMany(SentReminder, {
      foreignKey: 'patientId',
      as: 'sentReminders',
    });

    Patient.hasMany(SentRecall, {
      foreignKey: 'patientId',
      as: 'sentRecalls',
    });

    // This exists because some endpoints refer to 'chats' as 'chat' in the response
    Patient.hasMany(Chat, {
      foreignKey: 'patientId',
      as: 'chat',
    });

    Patient.hasMany(DeliveredProcedure, {
      foreignKey: 'patientId',
      as: 'deliveredProcedures',
    });

    Patient.hasMany(SentReview, {
      foreignKey: 'patientId',
      as: 'sentReviews',
    });

    Patient.hasMany(Review, {
      foreignKey: 'patientId',
      as: 'reviews',
    });
  };

  /**
   *
   * @param model
   * @returns {Promise.<void>}
   */
  Patient.uniqueValidate = async function (model) {
    const { accountId, email, mobilePhoneNumber } = model;
    if (!accountId) {
      throw new Error('model.accountId must exist on the model');
    }

    const noEmail = isUndefined(email) || isNull(email);
    const noMobilePhoneNumber = isUndefined(mobilePhoneNumber) || isNull(mobilePhoneNumber);
    if (noEmail && noMobilePhoneNumber) return;

    // Grab all models that match
    const $or = {};
    if (!noEmail) {
      $or.email = email;
    }

    if (!noMobilePhoneNumber) {
      $or.mobilePhoneNumber = mobilePhoneNumber;
    }

    const p = await Patient.findOne({
      where: {
        accountId,
        $or,
      },
    });

    if (p) {
      throw UniqueFieldError({ tableName: 'Patient' }, 'email or mobilePhoneNumber');
    }
  };

  /**
   *
   * @param dataArray
   * @returns {Promise.<{errors: Array, docs}>}
   */
  Patient.preValidateArray = async function (dataArray) {
    const errors = [];

    const onError = (field, doc) => {
      const error = UniqueFieldError({ tableName: 'Patient' }, field);
      error.patient = doc.dataValues;
      errors.push(error);
    };

    // Build instances of the models
    let docs = dataArray.map(p => Patient.build(p));

    // Now Do ORM Validation
    const validatedDocs = [];
    for (const d of docs) {
      try {
        await d.validate(); // validate against schema
        validatedDocs.push(d);
      } catch (err) {
        err.patient = d.dataValues;
        errors.push(err);
      }
    }

    // Now check uniqueness against each other
    docs = uniqWith(validatedDocs, (a, b) => {
      if (a.accountId && b.accountId && (a.accountId === b.accountId)) {
        if (a.mobilePhoneNumber && b.mobilePhoneNumber && (a.mobilePhoneNumber === b.mobilePhoneNumber)) {
          onError('mobilePhoneNumber', a);
          return true;
        }

        if (a.email && b.email && (a.email === b.email)) {
          onError('email', a);
          return true;
        }
      }
    });

    // Now that they are sanitized, validated, and unique against each other
    const finalDocs = [];
    for (const d of docs) {
      try {
        await Patient.uniqueValidate(d);
        finalDocs.push(d);
      } catch (err) {
        err.patient = d.dataValues;
        errors.push(err);
      }
    }

    docs = finalDocs;
    return { errors, docs };
  };

  Patient.uniqueAgainstEachOther = async (docs) => {
    const errs = [];
    const validDocs = uniqWith(docs, (a, b) => {
      if (a.accountId && b.accountId && (a.accountId === b.accountId)) {
        if (a.dataValues.mobilePhoneNumber && b.dataValues.mobilePhoneNumber
          && (a.dataValues.mobilePhoneNumber === b.dataValues.mobilePhoneNumber)) {
          errs.push(UniqueFieldError({ tableName: 'Patient' }, 'mobilePhoneNumber'));
          return true;
        }

        if (a.dataValues.email && b.dataValues.email &&
          (a.dataValues.email === b.dataValues.email)) {
          errs.push(UniqueFieldError({ tableName: 'Patient' }, 'email'));
          return true;
        }
      }
    });

    return { validDocs, errs };
  };


  /**
   *
   * @param dataArray
   * @returns {Promise.<Array.<Model>>}
   */
  Patient.batchSave = async function (dataArray) {
    const { docs, errors } = await Patient.preValidateArray(dataArray);
    const savableCopies = docs.map(d => d.get({ plain: true }));
    const response = await Patient.bulkCreate(savableCopies);
    if (errors.length) {
      const errorsResponse = errors.map((error) => {
        error.model = 'Patient';
        error.errorMessage = 'Patient save error';
        if (error.errors && error.errors[0]) {
          error.errorMessage = error.errors[0].message;
        }
        return error;
      });
      throw { docs: response, errors: errorsResponse };
    }

    return response;
  };

  Patient.allPatients = async function (db, segment) {

  };

  Patient.STATUS = STATUS;

  return Patient;
}
