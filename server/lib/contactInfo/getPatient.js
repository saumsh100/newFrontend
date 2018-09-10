
import getPatientFromEmail from './getPatientFromEmail';
import { getPatientFromCellPhoneNumber } from './getPatientFromCellPhoneNumber';

/**
 * Returns PoC based on data provided.
 * If Mobile phone number is provided, we will use getPatientFromCellPhoneNumber.
 * If email is provided, we will use getPatientFromEmail.
 * If none is provided, we return early null.
 * @param cellPhoneNumber
 * @param email
 * @param accountId
 * @return Promise<*>
 */
export default function getPatientBasedOnFieldsProvided(accountId, { cellPhoneNumber, email } = {}) {
  if (!cellPhoneNumber && !email) {
    return null;
  }

  if (cellPhoneNumber) {
    return getPatientFromCellPhoneNumber({
      cellPhoneNumber,
      accountId,
    });
  }

  return getPatientFromEmail({
    email,
    accountId,
  });
}
