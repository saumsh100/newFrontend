
import Patient from '../../entities/models/Patient';

export default function buildUnknownPatient(mobilePhoneNumber) {
  return new Patient({
    firstName: 'Unknown',
    lastName: 'Patient',
    cellPhoneNumber: mobilePhoneNumber,
    isUnknown: true,
  });
}
