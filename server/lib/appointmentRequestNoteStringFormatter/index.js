
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
  } = request.get();

  const practitionerName = practitioner == null ? 'No Preference' : nameFormatter(practitioner);
  const requestingPatientName = patientUser.id === requestingPatientUser.id ?
    'self' : nameFormatter(requestingPatientUser);

  const formattedString =
    'Date Requested: ' + moment(createdAt).format('MMMM Do, YYYY') + ' in ' + nullHandler(account.timezone)
    + '\r\nPatient Name: ' + nameFormatter(patientUser)
    + '\r\nReason for Booking: ' + nullHandler(service.name)
    + '\r\nPreferred Practitioner: ' + practitionerName
    + '\r\nEmail: ' + nullHandler(patientUser.email)
    + '\r\nPhone: ' + nullHandler(patientUser.phoneNumber)
    + '\r\nNote: ' + nullHandler(note)
    + '\r\nRequested By: ' + requestingPatientName;

  return formattedString;
}

function nameFormatter(jsonObject) {
  return nullHandler(jsonObject.firstName) + ' ' + nullHandler(jsonObject.lastName);
}

function nullHandler(field) {
  return field == null ? '' : field;
}
