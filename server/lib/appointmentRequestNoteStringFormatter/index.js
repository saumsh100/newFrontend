
import moment from 'moment-timezone';
import { formatPhoneNumber } from '../../../client/components/library/util/Formatters';

export function appointmentRequestNoteStringFormatter(request) {
  const {
    patientUser,
    practitioner,
    createdAt,
    note,
    service,
    account,
    requestingPatientUser,
    insuranceCarrier,
    insurerName,
    insuranceMemberId,
    insuranceGroupId,
  } = request;

  const invalidValueHandler = (val, fallback = '') => !val ? fallback : val;
  const nameFormatter = ({ firstName, lastName }) => invalidValueHandler(firstName) + ' ' + invalidValueHandler(lastName);
  const birthDateHandler = (birthDate) => !birthDate ? 'none' : moment(birthDate).format('DD/MM/YYYY');

  /**
   * Display the general request information
   */
  const practitionerName = !practitioner ? 'No Preference' : nameFormatter(practitioner);
  const generalRequestNote =
    'Date Requested: ' +
    moment.tz(createdAt, account.timezone || 'America/Vancouver').format('h:mmA, DD/MM/YY') + '\r\n' +
    'Reason for Booking: ' + service.name + '\r\n' +
    'Preferred Practitioner: ' + practitionerName + '\r\n' +
    'Note: ' + invalidValueHandler(note, 'none') + '\r\n\r\n' +
    'Patient Name: ' + nameFormatter(patientUser) + '\r\n' +
    'Phone Number: ' + invalidValueHandler((formatPhoneNumber(patientUser.phoneNumber)), 'none') + '\r\n' +
    'Email: ' + invalidValueHandler(patientUser.email, 'none') + '\r\n' +
    'Birth Date: ' + birthDateHandler(patientUser.birthDate) + '\r\n';

  /**
   * Display the insurance plan information if it is valid and not "Pay for myself"
   */
  const payForMySelfNote = 'Insurance Plan: Pay for myself';
  const insurancePlanNote = 'Insurance Plan: ' + insuranceCarrier + '\r\n' +
    'Insurer Name: ' + invalidValueHandler(insurerName, 'n/a') + '\r\n' +
    'Member Id: ' + invalidValueHandler(insuranceMemberId, 'none') + '\r\n' +
    'Group Id: ' + invalidValueHandler(insuranceGroupId, 'none');
  const insuranceNote = (!insuranceCarrier || insuranceCarrier === 'Pay for myself') ?
    payForMySelfNote : insurancePlanNote;

  /**
   * Set the requested patient note chunk, if the patient user is the same as requested patient
   * user,insurance note will be appended to the patient note above and requestedPatientNote would
   * just be "requested by self"
   */
  const sameRequestedPatientNote = 'Requested By: Self';
  const differentRequestedPatientNote =
    'Requested By: ' + nameFormatter(requestingPatientUser) + '\r\n' +
    'Phone Number: ' + invalidValueHandler((formatPhoneNumber(requestingPatientUser.phoneNumber)), 'none') + '\r\n' +
    'Email: ' + invalidValueHandler(requestingPatientUser.email, 'none') + '\r\n' +
    'Birth Date: ' + birthDateHandler(requestingPatientUser.birthDate) + '\r\n';
  const requestedPatientNote = (patientUser.id === requestingPatientUser.id) ?
    insuranceNote + '\r\n\r\n' + sameRequestedPatientNote : '\r\n' + differentRequestedPatientNote + insuranceNote;

  return generalRequestNote + requestedPatientNote;
}
