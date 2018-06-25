
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
    insuranceMemberId,
    insuranceGroupId,
  } = request;

  const nullHandler = (val, fallback = '') => val === null ? fallback : val;
  const nameFormatter = ({ firstName, lastName }) => nullHandler(firstName) + ' ' + nullHandler(lastName);
  const birthDateHandler = (birthDate) => birthDate === null ? 'none' : moment(birthDate).format('DD/MM/YYYY');
  const practitionerName = practitioner === null ? 'No Preference' : nameFormatter(practitioner);

  const requestNote =
    'Date Requested: ' +
    moment.tz(createdAt, account.timezone || 'America/Vancouver').format('h:mmA, DD/MM/YY') + '\r\n' +
    'Reason for Booking: ' + service.name + '\r\n' +
    'Preferred Practitioner: ' + practitionerName + '\r\n' +
    'Note: ' + nullHandler(note, 'none') + '\r\n\r\n' +
    'Patient Name: ' + nameFormatter(patientUser) + '\r\n' +
    'Phone Number: ' + nullHandler((formatPhoneNumber(patientUser.phoneNumber)), 'none') + '\r\n' +
    'Email: ' + nullHandler(patientUser.email, 'none') + '\r\n' +
    'Birth Date: ' + birthDateHandler(patientUser.birthDate) + '\r\n\r\n';

  const sameRequestingPatientInfo = 'Requested By: Self\r\n\r\n';
  const differentRequestingPatientInfo =
    'Requested By: ' + nameFormatter(requestingPatientUser) + '\r\n' +
    'Phone Number: ' + nullHandler((formatPhoneNumber(requestingPatientUser.phoneNumber)), 'none') + '\r\n' +
    'Email: ' + nullHandler(requestingPatientUser.email, 'none') + '\r\n' +
    'Birth Date: ' + birthDateHandler(requestingPatientUser.birthDate) + '\r\n\r\n';
  const requestingPatientInfo = (patientUser.id === requestingPatientUser.id) ?
    sameRequestingPatientInfo : differentRequestingPatientInfo;

  const payForMySelf = 'Insurance Plan: Pay for myself';
  const insurancePlan = 'Insurance Plan: ' + insuranceCarrier + '\r\n' +
    'Insurer Name: ' + null + '\r\n' +
    'Member Id: ' + nullHandler(insuranceMemberId, 'none') + '\r\n' +
    'Group Id: ' + nullHandler(insuranceGroupId, 'none');

  return (requestNote + requestingPatientInfo) +
    ((insuranceCarrier === null || insuranceCarrier === 'Pay for myself') ?
      payForMySelf : insurancePlan);
}
