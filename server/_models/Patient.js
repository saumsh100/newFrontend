
import uniqWith from 'lodash/uniqWith';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import customDataTypes from '../util/customDataTypes';
import { UniqueFieldError } from '../models/createModel/errors';

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

    /*notes: {
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

    isSyncedWithPms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    familyId: {
      type: DataTypes.UUID,
    },

    status: {
      type: DataTypes.ENUM,
      values: Object.keys(STATUS).map(key => STATUS[key]),
      defaultValue: STATUS.ACTIVE,
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

  Patient.associate = ({ Account, Appointment, Chat, SentRecall, Review, SentReview }) => {
    Patient.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Patient.hasMany(Appointment, {
      foreignKey: 'patientId',
      as: 'appointments',
    });

    Patient.hasMany(Chat, {
      foreignKey: 'patientId',
      as: 'chats',
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
        }

        if (a.dataValues.email && b.dataValues.email &&
          (a.dataValues.email === b.dataValues.email)) {
          errs.push(UniqueFieldError({ tableName: 'Patient' }, 'email'));
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
