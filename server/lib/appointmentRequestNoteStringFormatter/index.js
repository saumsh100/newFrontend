
import { formatPhoneNumber } from '../../../client/components/library/util/Formatters';

const moment = require('moment');

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

  const nullHandler = (val, fallback = '') => val === null ? fallback : val;
  const undefinedAndNullHandler = (val, fallback = '') => (val === undefined || val === null) ? fallback : val;
  const nameFormatter = ({ firstName, lastName }) => nullHandler(firstName) + ' ' + nullHandler(lastName);
  const birthDateHandler = (birthDate) => birthDate === null ? 'none' : moment(birthDate).format('DD/MM/YYYY');

  const practitionerName = practitioner === null ? 'No Preference' : nameFormatter(practitioner);
  const generalRequestNote =
    'Date Requested: ' +
    moment.tz(createdAt, account.timezone || 'America/Vancouver').format('h:mmA, DD/MM/YY') + '\r\n' +
    'Reason for Booking: ' + service.name + '\r\n' +
    'Preferred Practitioner: ' + practitionerName + '\r\n' +
    'Note: ' + nullHandler(note, 'none') + '\r\n\r\n' +
    'Patient Name: ' + nameFormatter(patientUser) + '\r\n' +
    'Phone Number: ' + nullHandler((formatPhoneNumber(patientUser.phoneNumber)), 'none') + '\r\n' +
    'Email: ' + nullHandler(patientUser.email, 'none') + '\r\n' +
    'Birth Date: ' + birthDateHandler(patientUser.birthDate) + '\r\n';

  const payForMySelfNote = 'Insurance Plan: Pay for myself\r\n';
  const insurancePlanNote = 'Insurance Plan: ' + insuranceCarrier + '\r\n' +
    'Insurer Name: ' + undefinedAndNullHandler(insurerName, 'n/a') + '\r\n' +
    'Member Id: ' + nullHandler(insuranceMemberId, 'none') + '\r\n' +
    'Group Id: ' + nullHandler(insuranceGroupId, 'none');
  const insuranceNote = (insuranceCarrier === null || insuranceCarrier === 'Pay for myself') ?
    payForMySelfNote : insurancePlanNote;

  const sameRequestedPatientNote = 'Requested By: Self';
  const differentRequestedPatientNote =
    'Requested By: ' + nameFormatter(requestingPatientUser) + '\r\n' +
    'Phone Number: ' + nullHandler((formatPhoneNumber(requestingPatientUser.phoneNumber)), 'none') + '\r\n' +
    'Email: ' + nullHandler(requestingPatientUser.email, 'none') + '\r\n' +
    'Birth Date: ' + birthDateHandler(requestingPatientUser.birthDate) + '\r\n';
  const requestedPatientNote = (patientUser.id === requestingPatientUser.id) ?
    insuranceNote + '\r\n\r\n' + sameRequestedPatientNote : '\r\n' + differentRequestedPatientNote + insuranceNote;

  return generalRequestNote + requestedPatientNote;
}
