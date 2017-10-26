
/**
 *
 * cannotSend
 *
 * @param patient
 * @param primaryType
 * @returns {{errors: Array, success: Array}}
 */
export function cannotSend(patient, primaryType) {
  const attrs = {
    email: 'email',
    sms: 'mobilePhoneNumber',
    phone: 'mobilePhoneNumber',
  };

  const types = {
    email: '1100',
    sms: '1200',
    phone: '1300',
  };

  // If it is undefined return the error code
  if (!patient[attrs[primaryType]]) {
    return types[primaryType];
  }
}

/**
 *
 * generateOrganizedPatients
 *
 * @param patients
 * @param primaryType
 * @returns {{errors: Array, success: Array}}
 */
export function generateOrganizedPatients(patients, primaryType) {
  const errors = [];
  const success = [];

  for (const patient of patients) {
    const errorCode = cannotSend(patient, primaryType);
    if (errorCode) {
      errors.push({
        patient,
        errorCode,
      });
    } else {
      success.push(patient);
    }
  }

  return { errors, success };
}


