
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import toArray from 'lodash/toArray';

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

const PREFERENCE_TYPES = {
  email: 'emailNotifications',
  sms: 'sms',
  phone: 'phone',
};

const NO_PREFERENCE_ERROR_CODES = {
  email: '2100',
  sms: '2200',
  phone: '2300',
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
 * noPreference
 *
 * @param patient
 * @param primaryType
 * @returns {{errors: Array, success: Array}}
 */
export function noPreference(patient, primaryType) {
  const preferences = patient.preferences || {};

  // If it is false return errorCode
  if (!preferences[PREFERENCE_TYPES[primaryType]]) {
    return NO_PREFERENCE_ERROR_CODES[primaryType];
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
      const errorCode = cannotSend(patient, primaryType) || noPreference(patient, primaryType);
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

/**
 * organizeForOutbox is a function that accepts an array and a selectorPredicate
 * and will group the array based on the selectorPredicate, and then map over that array
 * to return outbox items that have primaryTypes grouped together.
 *
 * NOTE: this is primarily a layer ontop of the mapPatientsTo____ calls that will take the flat
 * array with primaryType and bring it back into primaryTypes
 *
 * @param array (ie.// [{ patient, appointment, primaryType: 'sms' }, { patient, appointment, primaryType: 'email' }])
 * @param selectorPredicate (ie.// ({ patient, appointment }) => `${patient.id}_${appointment.id}`)
 * @param mergePredicate
 * @returns [organizedArray] (ie.// [{ patient, appointment, primaryTypes: ['sms', 'email'] }])
 */
export function organizeForOutbox(array, selectorPredicate, mergePredicate) {
  const groupedMap = groupBy(array, selectorPredicate);
  return toArray(map(groupedMap, mergePredicate));
}
