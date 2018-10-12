
import { getPatientFromKeyValue } from './getPatientFromCellPhoneNumber';

/**
 * Get PoC for email.
 * @param email
 * @param accountId
 * @return {Promise<*>}
 */
export function getPatientFromEmail({ email, accountId }) {
  return getPatientFromKeyValue(patientEmailQuery(email, accountId));
}

/**
 * Get a list of Patients for email.
 * @param email
 * @param accountId
 * @return {Promise<*>}
 */
export function getPatientListFromEmail({ email, accountId }) {
  return getPatientFromKeyValue(patientEmailQuery(email, accountId), false);
}

/**
 * Patient query for email
 *
 * @param email
 * @param accountId
 * @return {*}
 */
const patientEmailQuery = (email, accountId) => ({
  key: 'email',
  value: email,
  accountId,
});
