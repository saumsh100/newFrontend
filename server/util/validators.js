
/**
 * Validates phone number.
 * @param phoneNumber string phone number. Can be empty, null, undefined - anything.
 * @return {string|null} number String or null if invalid.
 */
function validatePhoneNumber(phoneNumber) {
  if (phoneNumber === null || phoneNumber === '') return null;

  if (!phoneNumber || typeof phoneNumber !== 'string' || !/^(\+1)?\s*?\d{3}-?\s*?\d{3}-?\s*?\d{4}$/.test(phoneNumber.trim())) {
    throw new Error(`Invalid phoneNumber format for "${phoneNumber}", use: +1 222 333 4444`);
  }

  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  return `${cleanPhoneNumber.length === 10 ? '+1' : '+'}${cleanPhoneNumber}`;
}

function validateAccountIdPmsId(Model, value, self, next) {
  return Model.findOne({
    where: {
      accountId: self.accountId,
      pmsId: value,
    },

    paranoid: false,
  }).then(async (model) => {
    if (model) {
      if (model.deletedAt) {
        model.setDataValue('deletedAt', null);
        model = await model.save({ paranoid: false });
      } else if (self.id === model.id) {
        return next();
      }

      return next({
        messages: 'AccountId PMS ID Violation',
        model,
      });
    }

    return next();
  });
}

function validatePractitionerIdPmsId(Model, value, self, next) {
  return Model.findOne({
    where: {
      practitionerId: self.practitionerId,
      pmsId: value,
    },

    paranoid: false,
  }).then(async (model) => {
    if (model) {
      if (model.deletedAt) {
        model.setDataValue('deletedAt', null);
        model = await model.save({ paranoid: false });
      } else if (self.id === model.id) {
        return next();
      }

      return next({
        messages: 'PractitionerId PMS ID Violation',
        model,
      });
    }

    return next();
  });
}

async function procedureExistsValidation(Procedure, procedureCodeId, codeType) {
  const procedure = await Procedure.findOne({
    where: {
      code: procedureCodeId,
    },
  });

  if (!procedure) {
    return await Procedure.create({
      code: procedureCodeId,
      codeType,
      type: 'unknown',
      isValidated: false,
    });
  }

  return procedure;
}

function isValidEmail(email) {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email);
}

module.exports = {
  validatePhoneNumber,
  validateAccountIdPmsId,
  procedureExistsValidation,
  validatePractitionerIdPmsId,
  isValidEmail,
};
