
const {
  adultChecker,
  grabPoC,
  isHead,
  isActive,
  getFromNewestCreatedFamily,
  getOldest,
} = require('./util');

/**
 * selectCorrectPatient is a function that will take an array of patients data and return
 * a patient based on rules around the data like:
 * - assign to the newest family head
 * - else if no family data, assign to the newest created patient
 *
 * @param patients - family data if on the object by patient.family
 * @return patient || null
 */
module.exports = function selectCorrectPatient(
  patients,
  [minAge, maxAge] = [18, 65],
) {
  // Early return if no patients in array
  if (!patients.length) {
    return null;
  }

  // Early return if it only found 1
  if (patients.length === 1) {
    return patients[0];
  }

  const pocGrabber = grabPoC(patients);

  const isAdult = adultChecker(minAge, maxAge);

  // Step 1 - look for active patients that are head of family
  const activeHead = pocGrabber(
    p => isActive(p) && isHead(p.family, p),
    getFromNewestCreatedFamily,
  );
  if (activeHead) return activeHead;

  // Step 2 - look for active "adults"
  const activeAdult = pocGrabber(p => isActive(p) && isAdult(p), getOldest);
  if (activeAdult) return activeAdult;

  // Step 3 - inactive heads
  const inactiveHead = pocGrabber(
    p => !isActive(p) && isHead(p.family, p),
    getFromNewestCreatedFamily,
  );
  if (inactiveHead) return inactiveHead;

  // Step 4 - oldest inactive adult patient
  const inactiveAdult = pocGrabber(
    p => !isActive(p) && isAdult(p),
    getFromNewestCreatedFamily,
  );
  if (inactiveAdult) return inactiveAdult;

  // Step 5 - oldest active patient
  const activeOldest = pocGrabber(p => isActive(p), getOldest);
  if (activeOldest) return activeOldest;

  // Step 6 - oldest active patient
  const inactiveOldest = pocGrabber(p => !isActive(p), getOldest);
  if (inactiveOldest) return inactiveOldest;

  // consistent return
  return null;
};
