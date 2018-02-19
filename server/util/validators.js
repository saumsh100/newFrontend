/**
 * Validates phone number.
 * @param phoneNumber string phone number. Can be empty, null, undefined - anything.
 * @return phone number String or null if invalid.
 */
function validatePhoneNumber(phoneNumber) {
  if (phoneNumber === null) return null;

  if (!phoneNumber || phoneNumber.length < 10) return undefined;

  const pn = phoneNumber.replace(/\D/g, '');

  if (pn.length === 10) {
    return '+1'.concat(pn);
  }
  if (pn.length === 11) {
    return '+'.concat(pn);
  }

  return undefined;
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

module.exports = {
  validatePhoneNumber,
  validateAccountIdPmsId,
  procedureExistsValidation,
  validatePractitionerIdPmsId,
};
