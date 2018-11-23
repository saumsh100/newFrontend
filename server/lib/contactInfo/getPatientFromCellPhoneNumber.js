
import { Account, Family, Patient, sequelize } from 'CareCruModels';
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
export async function fetchPatientsFromKeyValue({
  key,
  value,
  accountId,
  where = {},
}) {
  return Patient.findAll({
    where: [
      { accountId },
      ...(key ? [{ [key]: value }] : []),
      where,
    ],
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
 * @param where
 * @param single
 * @return {Promise<*>}
 */
export async function getPatientFromKeyValue(
  { key, value, accountId, where },
  single = true,
) {
  const patients = await exports.fetchPatientsFromKeyValue({
    key,
    value,
    accountId,
    where,
  });
  return single ? selectCorrectPatient(patients) : patients;
}

/**
 * Get the PoC from the cellPhoneNumber
 *
 * @param cellPhoneNumber
 * @param accountId
 * @return {Promise<*>}
 */
export async function getPatientFromCellPhoneNumber({
  cellPhoneNumber,
  accountId,
}) {
  return getPatientFromKeyValue(await patientCellPhoneQuery(cellPhoneNumber, accountId));
}

/**
 * Get a list of patients from cellPhoneNumber
 *
 * @param cellPhoneNumber
 * @param accountId
 * @return {Promise<*>}
 */
export async function getPatientListFromCellPhoneNumber({
  cellPhoneNumber,
  accountId,
}) {
  return getPatientFromKeyValue(
    await patientCellPhoneQuery(cellPhoneNumber, accountId),
    false,
  );
}

/**
 * Patient query using coalesce to normalize cellphone number
 *
 * @param cellPhoneNumber
 * @param accountId
 * @return {*}
 */
const patientCellPhoneQuery = async (cellPhoneNumber, accountId) => ({
  accountId,
  where: whereCellPhoneNumber(cellPhoneNumber, await getCellPhoneNumberFallback(accountId)),
});

/**
 * Get the cell phone number fall back order from account configuration
 * @param accountId
 * @returns {Promise<Account.cellPhoneNumberFallback>}
 */
export const getCellPhoneNumberFallback = async (accountId) => {
  const { cellPhoneNumberFallback } = await Account.findById(accountId);
  return cellPhoneNumberFallback;
};

export const whereCellPhoneNumber = (cellPhoneNumber, cellPhoneNumberFallback) => {
  return sequelize.where(
    sequelize.fn(
      'COALESCE',
      ...(cellPhoneNumberFallback.length > 0
        ? cellPhoneNumberFallback.map(f => sequelize.col(f))
        : [sequelize.col('mobilePhoneNumber')]),
    ),
    Array.isArray(cellPhoneNumber) ? { in: cellPhoneNumber } : cellPhoneNumber,
  );
};
