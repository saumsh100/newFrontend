
const orderBy = require('lodash/orderBy');

/**
 * isHead checks if a given patient is the head of the given family by comparing accountId,
 * familyId and headId.
 * @param family
 * @param patient
 * @return {boolean}
 */
const isHead = (family, patient) =>
  !!family &&
  !!patient &&
  family.accountId === patient.accountId &&
  family.id === patient.familyId &&
  family.headId === patient.id;

/**
 * isActive checks if a patient has status equals to the string 'Active'
 * @param patient
 * @return {boolean}
 */
const isActive = ({ status }) => status === 'Active';

/**
 * getFromNewestCreatedFamily orders the a list of patients by its family creation date and
 * grabs the first.
 * @param patients
 */
const getFromNewestCreatedFamily = patients =>
  orderBy(
    patients,
    ({ family: { pmsCreatedAt, createdAt } }) => pmsCreatedAt || createdAt,
    'desc',
  )[0];

/**
 * getOldest orders a list of patients by their birth dates and grabs the first, thus the oldest.
 * @param patients
 */
const getOldest = patients => orderBy(patients, p => p.birthDate, 'asc')[0];

/**
 * getPatientAge is a utility function to extract the patient age form its birth date by year
 * diffing. This was created using plain JS so we can reduce the usage of moment.js.
 * @param patient
 * @return {number}
 */
const getPatientAge = (patient) => {
  const ageDate = new Date(Date.now() - new Date(patient.birthDate).getTime());
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

/**
 * adultChecker is a configurable function builder that creates a function that will check if an age
 * of a patient is within the adult range provided to it.
 * @param min
 * @param max
 * @return {function(*=): boolean}
 */
const adultChecker = (min, max) => patient =>
  min < getPatientAge(patient) && getPatientAge(patient) < max;

/**
 * grabPoC is a function that takes a patient list and returns a function that filters this list by
 * the given predicate, in case of the filter returns more than one result the fallbackHandler is
 * applied to the list.
 * This function use partially applied arguments so we can reuse the same list of patients but with
 * different predicates and fallbackHandlers.
 * @param patients
 * @return {Function}
 */
const grabPoC = patients => (filterPredicate, fallbackHandler) => {
  const filteredPatients = patients.filter(filterPredicate);
  if (filteredPatients.length === 1) {
    return filteredPatients[0];
  } else if (filteredPatients.length > 1) {
    return fallbackHandler(filteredPatients);
  }

  return undefined;
};

module.exports = {
  adultChecker,
  grabPoC,
  isHead,
  isActive,
  getFromNewestCreatedFamily,
  getOldest,
};
