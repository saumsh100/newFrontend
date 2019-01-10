
const groupBy = require('lodash/groupBy');
const keyBy = require('lodash/keyBy');
const toArray = require('lodash/toArray');
const { channelAttributesMap } = require('../comms/util');
const selectCorrectPatient = require('./selectCorrectPatient');

const NOT_POC_ERROR_CODE = '3100';

/**
 * groupPatientsByChannelPoc is a function that is used to organize patients that are set to
 * receive communication into the correct PoC groupings so if they have a channel value like
 * "mobilePhoneNumber" the communication will be correctly sent to the PoC with the dependants
 * grouped under it
 *
 * @param patients
 * @param fetchedPatients
 * @param channel
 * @return { errors, success }
 */
module.exports = function groupPatientsByChannelPoc({ patients, fetchedPatients, channel }) {
  const attribute = channelAttributesMap[channel];
  const attributeGroups = toArray(groupBy(fetchedPatients, attribute));

  // Now we organize the proper family groupings so we can organize the patients at the end
  // into the proper buckets
  const pointsOfContactWithDependants = attributeGroups.map((attributeGroup) => {
    const poc = selectCorrectPatient(attributeGroup);

    // Stop the poc themself or non-family members from being a dependant
    const dependants = attributeGroup.filter(p => p.id !== poc.id && p.familyId === poc.familyId);
    return {
      poc,
      dependants,
    };
  });

  const returned = {};
  const patientsMap = keyBy(patients, 'id');
  const finalGroups = pointsOfContactWithDependants
    .map(({ poc, dependants }) =>
      // We assume all PoCs are needing to be contacted because we assume the fetchedPatients
      // are from the attribute values of the supplied patients
      ({
        primaryType: channel,
        patient: {
          ...(poc.get ? poc.get({ plain: true }) : poc),
          ...patientsMap[poc.id],
        },
        dependants: dependants
          .filter(d => patientsMap[d.id])
          .map(d => ({
            ...d,
            ...patientsMap[d.id],
          })),
      }))
    .filter(({ patient, dependants }) => {
      // If the poc is in the original patient list, this patient is "returned"
      if (patientsMap[patient.id]) {
        returned[patient.id] = true;
      }

      dependants.forEach(d => (returned[d.id] = true));

      // If the head is in the patients array or if any dependants are populated
      return patientsMap[patient.id] || dependants.length;
    });

  // Finally build the errors based on what did got get assigned
  const unseenPatients = patients.filter(p => !returned[p.id]);
  const errors = unseenPatients.map(p => ({
    patient: p,
    primaryType: channel,
    errorCode: NOT_POC_ERROR_CODE,
  }));

  return {
    errors,
    success: finalGroups,
  };
}
