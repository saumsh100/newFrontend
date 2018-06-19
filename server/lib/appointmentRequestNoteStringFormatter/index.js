
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
  } = request;

  const nullHandler = (val, fallback = '') => val === null ? fallback : val;
  const nameFormatter = ({ firstName, lastName }) => nullHandler(firstName) + ' ' + nullHandler(lastName);

  const practitionerName = practitioner === null ? 'No Preference' : nameFormatter(practitioner);
  const requestingPatientName = patientUser.id === requestingPatientUser.id ?
    'Self' : nameFormatter(requestingPatientUser);

  const formattedString =
    'Date Requested: ' + moment(createdAt).format('MMMM Do, YYYY')
    + ' in ' + nullHandler(account.timezone) + '\r\n'
    + 'Patient Name: ' + nameFormatter(patientUser) + '\r\n'
    + 'Reason for Booking: ' + service.name + '\r\n'
    + 'Preferred Practitioner: ' + practitionerName + '\r\n'
    + 'Email: ' + nullHandler(patientUser.email, 'none') + '\r\n'
    + 'Phone: ' + nullHandler((formatPhoneNumber(patientUser.phoneNumber)), 'none') + '\r\n'
    + 'Note: ' + nullHandler(note, 'none') + '\r\n'
    + 'Requested By: ' + requestingPatientName;

  return formattedString;
}
