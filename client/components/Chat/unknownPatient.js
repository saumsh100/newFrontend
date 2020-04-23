
import Patient from '../../entities/models/Patient';

export default function buildUnknownPatient(mobilePhoneNumber, prospect = null) {
  const isProspect = !!prospect && !!prospect.patientData;
  return new Patient({
    firstName: 'Unknown',
    lastName: 'Patient',
    cellPhoneNumber: mobilePhoneNumber,
    isUnknown: true,
    isProspect,
    request: prospect?.request,
    ...(isProspect ? prospect.patientData : {}),
  });
}
