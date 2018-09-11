
const groupBy = require('lodash/groupBy');
const orderBy = require('lodash/orderBy');
const toArray = require('lodash/toArray');

// Can't used Family model because the migrations use this function
const isHead = (family, patient) => family.accountId === patient.accountId &&
    family.id === patient.familyId &&
    family.headId === patient.id;

/**
 * selectCorrectPatient is a function that will take an array of patients data and return
 * a patient based on rules around the data like:
 * - assign to the newest family head
 * - else if no family data, assign to the newest created patient
 *
 * @param patients - family data if on the object by patient.family
 * @return patient || null
 */
module.exports = function selectCorrectPatient(patients) {
  // Early return if no patients in array
  if (!patients.length) {
    return null;
  }

  // Early return if it only found 1
  if (patients.length === 1) {
    return patients[0];
  }

  // Separate patients that have families and patients that don't have families
  const orderedPatients = orderBy(patients, p => p.pmsCreatedAt, 'desc');
  const patientsWithFamilies = orderedPatients.filter(p => p.family);

  // If there's no patients with family data, return the newest created patient
  if (patientsWithFamilies.length === 0) {
    return orderedPatients[0];
  }

  // Group by family, ordered by family.pmsCreatedAt
  // This object would look like
  // { [familyId1]: [patientsInFamily1], [familyId2]: [patientsInFamily2], ... }
  const families = toArray(groupBy(patientsWithFamilies, 'familyId'));

  // Select the newest family to work with for the rest of the function
  const orderedFamilies = orderBy(families, patientsInFamily => patientsInFamily[0].family.pmsCreatedAt, 'desc');

  // Order the families members by birthDate so the POC is the oldest member if not the head.
  const newestFamilyPatients = orderBy(orderedFamilies[0], p => p.birthDate, 'asc');

  // Return the family head or else return the newest created patient in family
  const familyHead = newestFamilyPatients.find(p => isHead(p.family, p));
  return familyHead || newestFamilyPatients[0];
};
