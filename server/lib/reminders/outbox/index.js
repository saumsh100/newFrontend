
import omit from 'lodash/omit';

/**
 * cleanRemindersSuccessData is a function that is used to remove circular JSON
 * by giving the outbox API what it needs
 *
 * @param data
 * @return cleanData
 */
export function cleanRemindersSuccessData(data) {
  const { patient, dependants } = data;
  return {
    ...data,
    patient: cleanPatientData(patient),
    dependants: dependants.map(p => cleanPatientData(p)),
  };
}

/**
 * cleanPatientData is used to remove circular JSON
 *
 * @param patient
 * @return cleanPatient
 */
export function cleanPatientData(patient) {
  return {
    ...omit(patient, ['appointments', 'appts', 'family']),
    appointment: patient.appointment ?
      omit(patient.appointment, ['patient']) :
      null,
  }
}
