
import uniqWith from 'lodash/uniqWith';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import customDataTypes from '../util/customDataTypes';
import { UniqueFieldError } from '../models/createModel/errors';

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

    phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes),
    homePhoneNumber: customDataTypes.phoneNumber('homePhoneNumber', DataTypes),
    mobilePhoneNumber: customDataTypes.phoneNumber('mobilePhoneNumber', DataTypes),
    workPhoneNumber: customDataTypes.phoneNumber('workPhoneNumber', DataTypes),
    otherPhoneNumber: customDataTypes.phoneNumber('otherPhoneNumber', DataTypes),

    prefPhoneNumber: {
      // TODO: this should be an enum
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
  }, {
    // Model Config
    indexes: [
      {
        name: 'accountId_email',
        unique: true,
        fields: ['accountId', 'email']
      },
      {
        name: 'accountId_mobilePhoneNumber',
        unique: true,
        fields: ['accountId', 'mobilePhoneNumber']
      },
    ],
  });

  Patient.associate = (({ Account }) => {
    Patient.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  });

  /**
   *
   * @param model
   * @returns {Promise.<void>}
   */
  Patient.uniqueValidate = async function (model) {
    const { accountId, email, mobilePhoneNumber } = model;
    // Grab all models that match

    const $or = {};
    if (isUndefined(email) || isNull(email)) {
      $or['Patient_accountId_email'] = [accountId, email];
    }

    if (isUndefined(mobilePhoneNumber) || isNull(mobilePhoneNumber)) {
      $or['Patient_accountId_mobilePhoneNumber'] = [accountId, mobilePhoneNumber];
    }

    // TODO: when this is working we can finish!
    const p = await Patient.findOne({
      where: {
        $or: {
          'accountId_email': [accountId, email],
          'accountId_mobilePhoneNumber': [accountId, mobilePhoneNumber],
        },
      },
    });

    if (p) {
      throw new Error('Patient with those unique attributes already exists');
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
      error['patient'] = doc;
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
        err.patient = d;
        errors.push(err);
      }
    }

    // Now check uniqueness against each other
    docs = uniqWith(validatedDocs, (a, b) => {
      if (a.accountId && b.accountId && a.accountId === b.accountId) {
        if (a.mobilePhoneNumber && b.mobilePhoneNumber && a.mobilePhoneNumber === b.mobilePhoneNumber) {
          onError('mobilePhoneNumber', a);
          return true;
        }

        if (a.email && b.email && a.email === b.email) {
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
        err.patient = d;
        errors.push(err);
      }
    }

    docs = finalDocs;
    return { errors, docs };
  };

  /**
   *
   * @param dataArray
   * @returns {Promise.<Array.<Model>>}
   */
  Patient.batchSave = async function (dataArray) {
    const { docs, errors } = await Patient.preValidateArray(dataArray);

    console.log('docs');
    console.log(docs);
    console.log('errors');
    console.log(errors);

    const response = await Patient.bulkCreate(docs);

    console.log('response');
    console.log(response);

    if (errors.length) {
      throw { docs: response, errors };
    }

    return response;
  };

  return Patient;
}
