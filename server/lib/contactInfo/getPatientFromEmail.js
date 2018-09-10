
import { getPatientFromKeyValue } from './getPatientFromCellPhoneNumber';

/**
 * Get PoC for email.
 * @param email
 * @param accountId
 * @return {Promise<*>}
 */
export default function getPatientFromEmail({ email, accountId }) {
  return getPatientFromKeyValue({
    key: 'email',
    value: email,
    accountId,
  });
}
