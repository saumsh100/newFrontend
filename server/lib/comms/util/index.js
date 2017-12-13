
const ATTRS = {
  email: 'email',
  sms: 'mobilePhoneNumber',
  phone: 'mobilePhoneNumber',
};

const ERROR_CODES = {
  email: '1100',
  sms: '1200',
  phone: '1300',
};

/**
 * cannotSend
 *
 * @param patient
 * @param primaryType
 * @returns {{errors: Array, success: Array}}
 */
export function cannotSend(patient, primaryType) {
  // If it is undefined return the error code
  if (!patient[ATTRS[primaryType]]) {
    return ERROR_CODES[primaryType];
  }
}

/**
 * generateOrganizedPatients will accept an array of patients and an
 * array of primaryTypes and will return the errors and successes based
 * on patientData. The point is to organize the failed responses so that
 * certain jobs can save a bulk amount to save time
 *
 * @param patients
 * @param primaryTypes (ie.// ['email', 'sms'])
 * @returns {{errors: Array, success: Array}}
 */
export function generateOrganizedPatients(patients, primaryTypes) {
  const errors = [];
  const success = [];

  for (const patient of patients) {
    primaryTypes.forEach((primaryType) => {
      const errorCode = cannotSend(patient, primaryType);
      if (errorCode) {
        errors.push({
          patient,
          errorCode,
          primaryType,
        });
      } else {
        success.push({ primaryType, patient });
      }
    });
  }

  return { errors, success };
}


