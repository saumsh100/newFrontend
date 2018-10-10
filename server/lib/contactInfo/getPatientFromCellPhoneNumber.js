
import { Family, Patient } from 'CareCruModels';
import selectCorrectPatient from './selectCorrectPatient';

/**
 * getPatientsFromKeyValue is an async function that will fetch patients data in an account
 * that have a field (a.k.a "key") that has the same value supplied
 *
 * - patients data = important data that helps make a decision about which patient to assign
 * to this key value pair that might be duplicated accross an account
 * - It also supports the ability to supply custom "where" queries that override the default
 * - Should be able to easily add the ability to support "secondaryKeys" so that its not just
 * checking one key value pair
 *
 * @param key
 * @param value
 * @param accountId
 * @param where
 * @return {[patients]}
 */
export async function fetchPatientsFromKeyValue({ key, value, accountId, where = {} }) {
  return Patient.findAll({
    where: {
      accountId,
      [key]: value,
      status: 'Active',
      ...where,
    },

    include: [
      {
        model: Family,
        as: 'family',
      },
    ],
  });
}

/**
 * getPatientFromKeyValue is an async function that will fetch patients based on some
 * key-value pair that is not unique and then run it through our logic that
 * chooses the correct patient to assign it to based on metadata
 *
 * @param key
 * @param value
 * @param accountId
 * @return {Promise<*>}
 */
export async function getPatientFromKeyValue({ key, value, accountId }) {
  const patients = await exports.fetchPatientsFromKeyValue({ key, value, accountId });
  return selectCorrectPatient(patients);
}

/**
 * getPatientFromCellPhoneNumber
 *
 * @param cellPhoneNumber
 * @param accountId
 * @return {Promise<*>}
 */
export async function getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId }) {
  return getPatientFromKeyValue({
    key: 'mobilePhoneNumber',
    value: cellPhoneNumber,
    accountId,
  });
}
